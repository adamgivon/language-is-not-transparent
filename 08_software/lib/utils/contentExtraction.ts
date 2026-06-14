/**
 * Extracts text content from Item.contentJson field
 */
export function extractTextFromContentJson(contentJson: any): string {
  // Handle string
  if (typeof contentJson === "string") return contentJson;

  // Handle object with text property
  if (contentJson?.text) return contentJson.text;

  // Handle array of content blocks
  if (Array.isArray(contentJson)) {
    return contentJson
      .map((block) => {
        if (typeof block === "string") return block;
        if (block?.text) return block.text;
        return "";
      })
      .join("");
  }

  // Fallback
  console.warn("Unexpected contentJson format:", contentJson);
  return "";
}

/**
 * Extracts text from API response (Item object)
 */
export function extractTextFromResponse(responseData: any): string {
  // Response is an Item object with contentJson
  if (responseData.contentJson) {
    return extractTextFromContentJson(responseData.contentJson);
  }

  // Fallback: check for direct text field
  if (responseData.text) return responseData.text;

  // Last resort
  console.warn("Could not extract text from response:", responseData);
  return "[No response text]";
}

/**
 * Extracts essence header from response text
 * Looks for ```ESSENCE\n...\n``` block
 * Returns extracted text or null if not found
 */
export function extractEssenceHeader(responseText: string): string | null {
  if (!responseText || typeof responseText !== "string") {
    return null;
  }

  const match = responseText.match(/```ESSENCE\n([\s\S]*?)\n```/);
  return match ? match[1].trim() : null;
}

/**
 * Combines essence header from previous response with current user prompt
 * Used for semantic anchor selection to provide conversational context
 *
 * @param essenceText - Extracted essence from previous response (or null)
 * @param userPrompt - Current user prompt text
 * @returns Combined text for embedding
 */
export function combineEssenceAndPrompt(
  essenceText: string | null,
  userPrompt: string
): string {
  if (!essenceText) {
    return userPrompt;
  }

  return `${essenceText}\n\n${userPrompt}`;
}
