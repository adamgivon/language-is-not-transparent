// import { composeInstructionsString } from "@/config/anchoring";

// export async function selectAnchorsManually(
//   tx: any,
//   sessionConfig: any,
//   projectVersion: string,
//   CONFIG_FORCED_PROTOCOLS: string[]
// ): Promise<{
//   instructionsString: string;
//   selectedNames: string[];
//   rounded: Record<string, number>;
//   retrievedVectorIds: string[];
//   protocolNames: string[]; //new - add to return type
// }> {
//   if (!sessionConfig.manualWeights) {
//     throw new Error("Manual mode requires manualWeights in config");
//   }

//   // Fetch specified anchors from config
//   const manualAnchorNames = Object.keys(sessionConfig.manualWeights);
//   const manualChunks = (await tx.anchorChunk.findMany({
//     where: {
//       version: projectVersion,
//       name: { in: manualAnchorNames },
//     },
//     select: { id: true, name: true, text: true, vectorId: true },
//   })) as Array<{
//     id: string;
//     name: string;
//     text: string;
//     vectorId: string | null;
//   }>;

//   // Validate all specified anchors exist
//   for (const anchorName of manualAnchorNames) {
//     const chunk = manualChunks.find(
//       (c) => c.name.toLowerCase() === anchorName.toLowerCase()
//     );
//     if (!chunk) {
//       throw new Error(`Manual anchor "${anchorName}" not found in database`);
//     }
//   }

//   // Use manual weights directly
//   const selectedNames = manualAnchorNames;
//   const rounded = sessionConfig.manualWeights;

//   // Fetch protocol chunks dynamically based on config
//   const protocolChunks = (await tx.anchorChunk.findMany({
//     where: {
//       name: { in: CONFIG_FORCED_PROTOCOLS },
//       version: projectVersion,
//     },
//     select: { name: true, text: true },
//   })) as Array<{ name: string; text: string }>;

//   // Sort protocol chunks according to order in CONFIG_FORCED_PROTOCOLS
//   const sortedProtocolChunks = protocolChunks.sort((a, b) => {
//     const indexA = CONFIG_FORCED_PROTOCOLS.indexOf(a.name);
//     const indexB = CONFIG_FORCED_PROTOCOLS.indexOf(b.name);
//     return indexA - indexB;
//   });

//   const protocolsText = sortedProtocolChunks.map((c) => c.text).join("\n\n");
//   const protocolNames = sortedProtocolChunks.map((c) => c.name);  //new - extract protocol names

//   // Filter out protocols from dynamic anchors
//   const dynamicChunks = manualChunks.filter(
//     (c) => !CONFIG_FORCED_PROTOCOLS.includes(c.name.toLowerCase())
//   );

//   // Sort by user-specified order from customOrder.fullOrder
//   const orderArray: string[] = sessionConfig.customOrder?.fullOrder || [];
//   const sortedChunks = [...dynamicChunks].sort((a, b) => {
//     const indexA = orderArray.indexOf(a.name.toLowerCase());
//     const indexB = orderArray.indexOf(b.name.toLowerCase());
//     // If not in order array, put at end
//     if (indexA === -1 && indexB === -1) return 0;
//     if (indexA === -1) return 1;
//     if (indexB === -1) return -1;
//     return indexA - indexB;
//   });

//   const dynamicAnchorsText = sortedChunks
//     .map((c) => `# ${c.name.toUpperCase()} ANCHOR\n${c.text}`)
//     .join("\n\n");
//   const dynamicAnchors = sortedChunks.map((c) => c.name.toLowerCase());
//   const dynamicWeights: Record<string, number> = {};
//   for (const c of sortedChunks) {
//     dynamicWeights[c.name.toLowerCase()] = rounded[c.name.toLowerCase()] ?? 0;
//   }

//   const instructionsString = composeInstructionsString({
//     mode: "anchored",
//     version: projectVersion,
//     protocolsText,
//     dynamicWeights,
//     dynamicAnchors,
//     dynamicAnchorsText,
//   });

//   return {
//     instructionsString,
//     selectedNames,
//     rounded,
//     retrievedVectorIds: [],
//     protocolNames,
//   };
// }

import { composeInstructionsString } from "@/config/anchoring";

export async function selectAnchorsManually(
  tx: any,
  sessionConfig: any,
  projectVersion: string,
  CONFIG_FORCED_PROTOCOLS: string[]
): Promise<{
  instructionsString: string;
  selectedNames: string[];
  rounded: Record<string, number>;
  retrievedVectorIds: string[];
  protocolNames: string[];
}> {
  if (!sessionConfig.manualWeights) {
    throw new Error("Manual mode requires manualWeights in config");
  }

  // Get anchor names in user-specified order from customOrder.fullOrder
  const fullOrder: string[] = sessionConfig.customOrder?.fullOrder || [];
  const manualAnchorNames =
    fullOrder.length > 0 ? fullOrder : Object.keys(sessionConfig.manualWeights);

  // Fetch all anchor chunks (both protocols and dynamic anchors)
  const allChunks = (await tx.anchorChunk.findMany({
    where: {
      version: projectVersion,
      name: { in: manualAnchorNames },
    },
    select: { id: true, name: true, text: true, vectorId: true },
  })) as Array<{
    id: string;
    name: string;
    text: string;
    vectorId: string | null;
  }>;

  // Validate all specified anchors exist
  for (const anchorName of manualAnchorNames) {
    const chunk = allChunks.find(
      (c) => c.name.toLowerCase() === anchorName.toLowerCase()
    );
    if (!chunk) {
      throw new Error(`Manual anchor "${anchorName}" not found in database`);
    }
  }

  // Fetch protocol chunks
  const protocolChunks = (await tx.anchorChunk.findMany({
    where: {
      name: { in: CONFIG_FORCED_PROTOCOLS },
      version: projectVersion,
    },
    select: { name: true, text: true },
  })) as Array<{ name: string; text: string }>;

  // Sort protocol chunks according to CONFIG_FORCED_PROTOCOLS order
  const sortedProtocolChunks = protocolChunks.sort((a, b) => {
    const indexA = CONFIG_FORCED_PROTOCOLS.indexOf(a.name);
    const indexB = CONFIG_FORCED_PROTOCOLS.indexOf(b.name);
    return indexA - indexB;
  });

  const protocolsText = sortedProtocolChunks.map((c) => c.text).join("\n\n");
  const protocolNames = sortedProtocolChunks.map((c) => c.name);

  // Separate dynamic anchors from protocols (maintaining user order)
  const protocolNamesLower = CONFIG_FORCED_PROTOCOLS.map((p) =>
    p.toLowerCase()
  );
  const dynamicAnchorNames = manualAnchorNames.filter(
    (name) => !protocolNamesLower.includes(name.toLowerCase())
  );

  //new - Build rounded object in user-specified order (after dynamicAnchorNames is defined)
  const rounded: Record<string, number> = {};
  for (const name of dynamicAnchorNames) {
    //new - dynamicAnchorNames is in correct order
    const nameLower = name.toLowerCase();
    rounded[nameLower] = sessionConfig.manualWeights[nameLower] ?? 0;
  }

  // Build dynamic anchors text and arrays using user order
  const dynamicAnchorsText = dynamicAnchorNames
    .map((name) => {
      const chunk = allChunks.find(
        (c) => c.name.toLowerCase() === name.toLowerCase()
      );
      return chunk
        ? `# ${chunk.name.toUpperCase()} ANCHOR\n${chunk.text}`
        : null;
    })
    .filter(Boolean)
    .join("\n\n");

  const dynamicAnchors = dynamicAnchorNames.map((name) => name.toLowerCase());

  const dynamicWeights: Record<string, number> = {};
  for (const name of dynamicAnchorNames) {
    dynamicWeights[name.toLowerCase()] = rounded[name.toLowerCase()] ?? 0;
  }

  const instructionsString = composeInstructionsString({
    mode: "anchored",
    version: projectVersion,
    protocolsText,
    protocolNames,
    dynamicWeights,
    dynamicAnchors,
    dynamicAnchorsText,
  });

  return {
    instructionsString,
    selectedNames: dynamicAnchors,
    rounded,
    retrievedVectorIds: [],
    protocolNames,
  };
}
