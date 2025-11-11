import { callLLM } from "@/lib/llm";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      inspirations,
    }: {
      inspirations: string[];
    } = body;

    console.log("Category generation request:", { inspirations });

    const message = `I have an educational app that makes spelling vocabulary
lists for elementary students. For this task, you will generate 3 spelling
word group/categories from the following words: ${inspirations.join(", ")}.
Remember the categories should be related to the words. Some examples of categories are:
- words with silent 'e'
- long 'a' sound words
- common verbs and adjectives
You must always only return in the JSON format: { "categories": ["category1", "category2", "category3"] }`;

    console.log("Calling LLM for categories with message:", message);

    const llmResult = await callLLM<{
      categories: string[];
    }>(message);

    console.log("LLM result for categories:", llmResult);

    const { categories }: { categories: string[] } = llmResult;
    return new Response(JSON.stringify({ categories: categories }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in categories generation API:", error);

    return new Response(
      JSON.stringify({
        error: "Failed to generate categories",
        message: error instanceof Error ? error.message : "Unknown error",
        details: error,
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
}
