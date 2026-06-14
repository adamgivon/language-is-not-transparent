// lib/anchoring/forensics.ts
// Helper function to create ItemAnchor rows with forensics

export async function createItemAnchorRows(
  tx: any,
  projectVersion: string,
  projectName: string,
  sessionName: string,
  selectedNames: string[],
  rounded: Record<string, number>,
  promptVectorId: string,
  projectId: string,
  newPromptVectorId: string | null, //new - combined embedding vector ID
  vecSvc: any,
  protocolNames: string[] = [] //new - add protocol names parameter
): Promise<Omit<any, "id" | "createdAt">[]> {
  // Fetch ALL anchors for forensics
  const allAnchors = await tx.anchorChunk.findMany({
    where: { version: projectVersion },
    select: { id: true, name: true, vectorId: true },
  });

  // Compare prompt to ALL anchors
  const anchorRows: any[] = [];

  for (const anchor of allAnchors) {
    const anchorNameLower = anchor.name.toLowerCase();
    const isSelected = selectedNames.includes(anchorNameLower);

    // Compute prompt-only similarity (forensic)
    let promptSimilarity = null;
    if (anchor.vectorId) {
      try {
        promptSimilarity = await vecSvc.compare(
          projectId,
          promptVectorId,
          anchor.vectorId,
          "prompts",
          "anchors"
        );
      } catch (err) {
        console.warn(`Failed to compare prompt to anchor ${anchor.name}:`, err);
      }
    }

    //new - Compute combined (essence+prompt) similarity
    let newPromptSimilarity = null;
    if (anchor.vectorId && newPromptVectorId) {
      try {
        newPromptSimilarity = await vecSvc.compare(
          projectId,
          newPromptVectorId,
          anchor.vectorId,
          "prompts",
          "anchors"
        );
      } catch (err) {
        console.warn(
          `Failed to compare newPrompt to anchor ${anchor.name}:`,
          err
        );
      }
    }

    anchorRows.push({
      itemId: null as any,
      projectName,
      sessionName,
      contentJson: null,
      anchorChunkId: anchor.id,
      anchorName: anchorNameLower,
      weight: isSelected ? rounded[anchorNameLower] ?? null : null,
      promptSimilarity, //new - forensic only
      newPromptSimilarity, //new - used for selection in semantic mode
      responseSimilarity: null,
      activationDelta: null,
      alwaysIncluded: protocolNames
        .map((p) => p.toLowerCase())
        .includes(anchorNameLower), //new - mark protocols as alwaysIncluded
    });
  }

  return anchorRows;
}
