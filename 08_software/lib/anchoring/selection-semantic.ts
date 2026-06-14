import {
  sumNormalize,
  applyFloors,
  roundToDp,
  composeInstructionsString,
} from "@/config/anchoring";

export async function selectAnchorsSemanticly(
  tx: any,
  vecSvc: any,
  promptEmb: { vectorId: string; vector: number[] | Float32Array },
  authoritativeProjectId: string,
  projectVersion: string,
  CONFIG_SIM_FLOOR: number,
  CONFIG_MAX_SELECTED: number | null,
  CONFIG_FORCED_ANCHORS: Record<string, number>,
  CONFIG_FORCED_PROTOCOLS: string[],
  CONFIG_WEIGHT_PRECISION: number
): Promise<{
  instructionsString: string;
  selectedNames: string[];
  rounded: Record<string, number>;
  retrievedVectorIds: string[];
  protocolNames: string[];
}> {
  // Fetch all anchors
  const allAnchors = (await tx.anchorChunk.findMany({
    where: { version: projectVersion },
    select: { id: true, name: true, text: true, vectorId: true },
  })) as Array<{
    id: string;
    name: string;
    text: string;
    vectorId: string | null;
  }>;

  // Compare prompt embedding to ALL anchors (forensic requirement)
  const allSimilarities: Array<{
    id: string;
    name: string;
    score: number;
    vectorId: string | null;
    text: string;
  }> = [];

  for (const anchor of allAnchors) {
    if (!anchor.vectorId) {
      allSimilarities.push({
        id: anchor.id,
        name: anchor.name.toLowerCase(),
        score: 0,
        vectorId: null,
        text: anchor.text,
      });
      continue;
    }
    const similarity = await vecSvc.compare(
      authoritativeProjectId,
      promptEmb.vectorId,
      anchor.vectorId,
      "prompts",
      "anchors"
    );
    console.log(
      `[DEBUG COMPARE] Comparing prompt ${promptEmb.vectorId.substring(
        0,
        16
      )}... to anchor ${anchor.name}: ${similarity.toFixed(4)}`
    );
    allSimilarities.push({
      id: anchor.id,
      name: anchor.name.toLowerCase(),
      score: similarity,
      vectorId: anchor.vectorId,
      text: anchor.text,
    });
  }

  // ============================================================================
  // PHASE 1: SELECTION (using raw similarity scores)
  // ============================================================================

  // Filter by threshold and exclude structural (protocols, harmony)
  const candidates = allSimilarities
    .filter((c) => c.score >= CONFIG_SIM_FLOOR)
    .filter((c) => !CONFIG_FORCED_PROTOCOLS.includes(c.name));

  console.log("=== SEMANTIC SELECTION DEBUG ===");
  console.log("CONFIG_SIM_FLOOR:", CONFIG_SIM_FLOOR);
  console.log("CONFIG_MAX_SELECTED:", CONFIG_MAX_SELECTED);
  console.log("CONFIG_FORCED_PROTOCOLS:", CONFIG_FORCED_PROTOCOLS);
  console.log(
    "All similarities:",
    allSimilarities.map((a) => `${a.name}: ${a.score.toFixed(4)}`)
  );
  console.log(
    "Candidates after filtering:",
    candidates.map((c) => `${c.name}: ${c.score.toFixed(4)}`)
  );
  console.log("================================");

  const retrievedVectorIds = candidates
    .map((c) => c.vectorId)
    .filter((v): v is string => v !== null);

  // Fetch forced anchor chunks (from config)
  const forcedAnchorNames = Object.keys(CONFIG_FORCED_ANCHORS);
  const forcedChunks = (await tx.anchorChunk.findMany({
    where: {
      version: projectVersion,
      name: { in: forcedAnchorNames },
    },
    select: { id: true, name: true, text: true, vectorId: true },
  })) as Array<{
    id: string;
    name: string;
    text: string;
    vectorId: string | null;
  }>;

  // Validate forced anchors exist (from config)
  for (const forcedName of forcedAnchorNames) {
    const chunk = forcedChunks.find(
      (c) => c.name.toLowerCase() === forcedName.toLowerCase()
    );
    if (!chunk) {
      throw new Error(
        `NO_VIABLE_ANCHORS: forced anchor "${forcedName}" not found in database`
      );
    }
  }

  // Sort candidates by raw similarity (descending)
  const sortedCandidates = [...candidates].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.name.localeCompare(b.name);
  });

  // Take top N from sorted list (use config value)
  const topN = CONFIG_MAX_SELECTED ?? sortedCandidates.length;
  let topAnchors = sortedCandidates.slice(0, topN);
  console.log("=== TOP SELECTION ===");
  console.log("topN:", topN);
  console.log(
    "topAnchors:",
    topAnchors.map((a) => `${a.name}: ${a.score.toFixed(4)}`)
  );
  console.log("=====================");

  // Check which forced anchors are missing
  const missingForced: string[] = [];
  for (const forcedName of forcedAnchorNames) {
    const hasIt = topAnchors.some(
      (c) => c.name.toLowerCase() === forcedName.toLowerCase()
    );
    if (!hasIt) {
      missingForced.push(forcedName);
    }
  }

  /// Add missing forced anchors, removing weakest non-forced ONLY if at capacity
  for (const forcedName of missingForced) {
    const chunk = forcedChunks.find(
      (c) => c.name.toLowerCase() === forcedName.toLowerCase()
    );
    if (!chunk) continue;

    // Only remove if we're at or over capacity
    if (topAnchors.length >= topN) {
      // Find weakest anchor that is NOT a forced anchor
      let weakestIdx = -1;
      for (let i = topAnchors.length - 1; i >= 0; i--) {
        if (!forcedAnchorNames.includes(topAnchors[i].name.toLowerCase())) {
          weakestIdx = i;
          break;
        }
      }

      // Remove weakest non-forced anchor
      if (weakestIdx >= 0) {
        topAnchors.splice(weakestIdx, 1);
      }
    }

    // Add forced anchor
    topAnchors.push({
      id: chunk.id,
      vectorId: chunk.vectorId!,
      score: 0,
      name: chunk.name.toLowerCase(),
      text: chunk.text,
    });
  }

  // ============================================================================
  // PHASE 2: NORMALIZATION & FLOOR ENFORCEMENT
  // ============================================================================

  // Build weights by name from raw scores
  const weightsByName: Record<string, number> = {};
  for (const c of topAnchors) {
    weightsByName[c.name] = c.score;
  }

  // Sum-normalize (weights should sum to 1.0)
  const normalized = sumNormalize(weightsByName);
  console.log("[DEBUG NORM] After sumNormalize:", normalized);

  // Apply floors with space recalculation
  const withFloors = applyFloors(normalized, CONFIG_FORCED_ANCHORS);
  console.log("[DEBUG NORM] After applyFloors:", withFloors);

  // Round to 4 decimal places (temporary, will be rebuilt in sorted order)
  const roundedTemp: Record<string, number> = {};
  for (const [name, w] of Object.entries(withFloors)) {
    roundedTemp[name] = roundToDp(w, CONFIG_WEIGHT_PRECISION);
  }

  // Final selection: map back to chunks
  const selectedNames = Object.keys(roundedTemp);
  const selectedChunks = topAnchors.filter((c) =>
    selectedNames.includes(c.name)
  );

  // Verify all selected anchors have vectorId
  const missingVector = selectedChunks.find((c) => !c.vectorId);
  if (missingVector) {
    throw new Error(
      `Selected anchor missing vectorId: ${
        missingVector.name || missingVector.id
      }`
    );
  }

  // Sort selected chunks by final weight (descending)
  const selectedOrdered = selectedChunks.sort(
    (a, b) =>
      (roundedTemp[b.name] ?? 0) - (roundedTemp[a.name] ?? 0) ||
      a.name.localeCompare(b.name)
  );

  //new - Build rounded in weight-sorted order (after selectedOrdered is created)
  const rounded: Record<string, number> = {};
  for (const c of selectedOrdered) {
    //new - iterate in weight-sorted order
    rounded[c.name.toLowerCase()] = roundedTemp[c.name.toLowerCase()] ?? 0;
  }

  // Fetch protocol chunks dynamically based on config
  const protocolChunks = (await tx.anchorChunk.findMany({
    where: {
      name: { in: CONFIG_FORCED_PROTOCOLS },
      version: projectVersion,
    },
    select: { name: true, text: true },
  })) as Array<{ name: string; text: string }>;

  // Sort protocol chunks according to order in CONFIG_FORCED_PROTOCOLS
  const sortedProtocolChunks = protocolChunks.sort((a, b) => {
    const indexA = CONFIG_FORCED_PROTOCOLS.indexOf(a.name);
    const indexB = CONFIG_FORCED_PROTOCOLS.indexOf(b.name);
    return indexA - indexB;
  });

  const protocolsText = sortedProtocolChunks.map((c) => c.text).join("\n\n");
  const protocolNames = sortedProtocolChunks.map((c) => c.name); //new - extract protocol names

  // Build dynamic anchor data (selectedOrdered already excludes protocols)
  const dynamicAnchorsText = selectedOrdered
    .map((c) => `# ${c.name.toUpperCase()} ANCHOR\n${c.text}`)
    .join("\n\n");
  const dynamicAnchors = selectedOrdered.map((c) => c.name.toLowerCase());
  const dynamicWeights: Record<string, number> = {};
  for (const c of selectedOrdered) {
    dynamicWeights[c.name.toLowerCase()] = rounded[c.name.toLowerCase()] ?? 0;
  }

  // Compose instructions string with new structure
  const instructionsString = composeInstructionsString({
    mode: "anchored",
    version: projectVersion,
    protocolNames,
    protocolsText,
    dynamicWeights,
    dynamicAnchors,
    dynamicAnchorsText,
  });

  console.log("[DEBUG FINAL WEIGHTS] rounded:", rounded);
  console.log(
    "[DEBUG FINAL WEIGHTS] topAnchors scores:",
    topAnchors.map((a) => `${a.name}:${a.score.toFixed(4)}`)
  );

  return {
    instructionsString,
    selectedNames: dynamicAnchors, //new - use weight-sorted array (from selectedOrdered) instead of Object.keys(rounded)
    rounded,
    retrievedVectorIds,
    protocolNames,
  };
}
