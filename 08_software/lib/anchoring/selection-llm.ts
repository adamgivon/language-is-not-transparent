import OpenAI from "openai";
import {
  composeInstructionsString,
  LLM_SELECTION_MODEL,
} from "@/config/anchoring";
import { extractResponseText } from "@/types/openai";

export async function selectAnchorsWithLLM(
  tx: any,
  sessionId: string,
  trimmedUserText: string,
  sessionConfig: any,
  projectVersion: string,
  CONFIG_MAX_SELECTED: number | null,
  CONFIG_FORCED_ANCHORS: Record<string, number>,
  CONFIG_FORCED_PROTOCOLS: string[]
): Promise<{
  instructionsString: string;
  selectedNames: string[];
  rounded: Record<string, number>;
  retrievedVectorIds: string[];
  llmResponseData: any;
  protocolNames: string[]; //new - add to return type
}> {
  // Get all available anchors
  const allAnchors = (await tx.anchorChunk.findMany({
    where: { version: projectVersion },
    select: { id: true, name: true, text: true, vectorId: true },
  })) as Array<{
    id: string;
    name: string;
    text: string;
    vectorId: string | null;
  }>;

  // Fetch last 5 Items from session for conversation context
  const recentItems = (await tx.item.findMany({
    where: { sessionId },
    orderBy: { seq: "desc" },
    take: 5,
    select: { role: true, contentJson: true, seq: true },
  })) as Array<{
    role: string;
    contentJson: any;
    seq: number;
  }>;

  // Reverse to get chronological order (oldest first)
  const conversationHistory = recentItems.reverse();

  // Format conversation context
  let contextText = "";
  if (conversationHistory.length > 0) {
    contextText =
      "\n\nConversation context (last " +
      conversationHistory.length +
      " messages):\n";
    for (const item of conversationHistory) {
      const text = item.contentJson?.text || "[no text]";
      const role = item.role.toLowerCase();
      contextText += `${role}: ${text}\n`;
    }
    contextText += "\n";
  }

  // Build system instructions
  const systemInstructions = `You are an anchor selection system. You need to choose which chunks serve as PROTOCOLS and which serve as ANCHORS for the user's prompt.

  PROTOCOLS vs ANCHORS:
  - PROTOCOLS: Structural/meta elements that shape HOW the response is made. They provide procedural guidance. Protocols have NO weights but ORDER matters (first protocol is applied 
  first, etc.)
  - ANCHORS: Conceptual domains that determine WHAT content appears in the response. They shape the substance and perspective. Anchors require WEIGHTS (must sum to 1.0) but order 
  doesn't matter.

  Rules:
  - A chunk can be EITHER a protocol OR an anchor, never both
  - Select protocols AS NEEDED (choose whatever structural guidance is appropriate)
  - Select up to ${CONFIG_MAX_SELECTED || 7} ANCHORS${
    Object.keys(CONFIG_FORCED_ANCHORS).length > 0
      ? `\n- Must include as anchors: ${Object.keys(CONFIG_FORCED_ANCHORS).join(
          ", "
        )}\n- These forced anchors must have minimum weights: ${JSON.stringify(
          CONFIG_FORCED_ANCHORS
        )}`
      : ""
  }
  - Anchor weights must sum to 1.0
  - Protocol order matters: list them in order of application

  Return ONLY valid JSON in this exact format:
  {
    "protocols": ["protocol1", "protocol2"],
    "anchors": ["anchor1", "anchor2"],
    "weights": {"anchor1": 0.6, "anchor2": 0.4},
    "reasoning": "brief explanation of your choices"
  }

  If no protocols are needed, use empty array: "protocols": []`;

  // Build user prompt with available anchors
  const userPromptText = `${contextText}Current user prompt: "${trimmedUserText}"

  Available chunks (use EXACT names in your response):
  ${allAnchors
    .map(
      (a) => `
  ## CHUNK NAME: ${a.name}
  ${a.text}
  `
    )
    .join("\n")}

  Select protocols and anchors using the exact chunk names shown above.`;

  console.log("=== LLM ANCHOR SELECTION ===");
  console.log("System instructions:", systemInstructions);
  console.log("Full prompt sent to LLM:", userPromptText);
  // console.log("User prompt:", trimmedUserText);
  console.log("Available chunks count:", allAnchors.length);
  console.log("Max anchors:", CONFIG_MAX_SELECTED);

  // Call OpenAI Responses API
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const llmResponse = await openai.responses.create({
    model: LLM_SELECTION_MODEL,
    instructions: systemInstructions,
    input: [
      {
        role: "user",
        content: [{ type: "input_text", text: userPromptText }],
      },
    ],
    temperature: 1,
  });

  console.log("LLM Response ID:", llmResponse.id);
  console.log("LLM Status:", (llmResponse as any).status);

  // Extract output text using helper
  const outputText = extractResponseText(llmResponse);
  console.log("LLM Raw Output:", outputText);

  if (!outputText) {
    throw new Error("LLM returned empty response");
  }

  // Parse JSON response
  let selection: any;
  try {
    selection = JSON.parse(outputText);
  } catch (err) {
    console.error("Failed to parse LLM output as JSON:", outputText);
    throw new Error("LLM did not return valid JSON");
  }

  console.log("LLM Selection:", JSON.stringify(selection, null, 2));
  console.log("============================");

  // Validate selection
  if (!selection.anchors || !selection.weights) {
    throw new Error("LLM did not return valid anchor selection format");
  }

  // protocols can be empty array, but must exist
  if (!Array.isArray(selection.protocols)) {
    throw new Error("LLM did not return valid protocols array");
  }

  const selectedNames = selection.anchors;
  const roundedTemp = selection.weights; //new - rename to temp
  const llmSelectedProtocols = selection.protocols;

  // Fetch protocol chunks based on LLM selection
  const protocolChunks = (await tx.anchorChunk.findMany({
    where: {
      name: { in: llmSelectedProtocols },
      version: projectVersion,
    },
    select: { name: true, text: true },
  })) as Array<{ name: string; text: string }>;

  // Sort protocol chunks according to LLM-specified order
  const sortedProtocolChunks = protocolChunks.sort((a, b) => {
    const indexA = llmSelectedProtocols.indexOf(a.name);
    const indexB = llmSelectedProtocols.indexOf(b.name);
    return indexA - indexB;
  });

  const protocolsText = sortedProtocolChunks.map((c) => c.text).join("\n\n");
  const protocolNames = sortedProtocolChunks.map((c) => c.name); //new - extract protocol names

  // Fetch selected anchor chunks
  const selectedChunks = (await tx.anchorChunk.findMany({
    where: {
      version: projectVersion,
      name: { in: selectedNames },
    },
    select: { id: true, name: true, text: true, vectorId: true },
  })) as Array<{
    id: string;
    name: string;
    text: string;
    vectorId: string | null;
  }>;

  console.log("=== CHUNK FETCH DEBUG ===");
  console.log("LLM selectedNames:", selectedNames);
  console.log(
    "Fetched selectedChunks:",
    selectedChunks.map((c) => c.name)
  );
  console.log("llmSelectedProtocols:", llmSelectedProtocols);
  console.log("========================");

  // Filter out LLM-selected protocols from dynamic anchors
  const dynamicChunks = selectedChunks.filter(
    (c) =>
      !llmSelectedProtocols
        .map((p: string) => p.toLowerCase())
        .includes(c.name.toLowerCase())
  );

  // Sort dynamic chunks according to LLM-specified order (selection.anchors array)
  const sortedDynamicChunks = dynamicChunks.sort((a, b) => {
    const indexA = selectedNames.indexOf(a.name);
    const indexB = selectedNames.indexOf(b.name);
    return indexA - indexB;
  });

  //new - Build rounded in LLM-specified order (after sortedDynamicChunks is created)
    const rounded: Record<string, number> = {};
    for (const c of sortedDynamicChunks) { //new - iterate in LLM order
      rounded[c.name.toLowerCase()] = roundedTemp[c.name.toLowerCase()] ?? 0;
    }

  const dynamicAnchorsText = sortedDynamicChunks
    .map((c) => `# ${c.name.toUpperCase()} ANCHOR\n${c.text}`)
    .join("\n\n");
  const dynamicAnchors = sortedDynamicChunks.map((c) => c.name.toLowerCase());
  const dynamicWeights: Record<string, number> = {};
  for (const c of sortedDynamicChunks) {
    dynamicWeights[c.name.toLowerCase()] = rounded[c.name.toLowerCase()] ?? 0;
  }

  console.log("=== INSTRUCTION COMPOSITION DEBUG ===");
  console.log("protocolsText length:", protocolsText.length);
  console.log("dynamicChunks count:", sortedDynamicChunks.length);
  console.log("dynamicAnchors:", dynamicAnchors);
  console.log("dynamicWeights:", dynamicWeights);
  console.log("dynamicAnchorsText length:", dynamicAnchorsText.length);
  console.log("====================================");

  const instructionsString = composeInstructionsString({
    mode: "anchored",
    version: projectVersion,
    protocolNames,
    protocolsText,
    dynamicWeights,
    dynamicAnchors,
    dynamicAnchorsText,
  });

  // Prepare LLM response data for Item.meta storage
  const llmResponseData = {
    response_id: llmResponse.id,
    model: (llmResponse as any).model || LLM_SELECTION_MODEL,
    selection: {
      protocols: selection.protocols,
      anchors: selection.anchors,
      weights: selection.weights,
      reasoning: selection.reasoning || "",
    },
    raw_output: outputText,
  };

  return {
    instructionsString,
    selectedNames,
    rounded,
    retrievedVectorIds: [], // LLM mode doesn't use FAISS retrieval
    llmResponseData,
    protocolNames: llmSelectedProtocols,
  };
}
