import { callLLM } from "@/lib/llm";

export async function POST(request: Request) {
  const body = await request.json();

  const {
    inspirations,
  }: {
    inspirations: string[];
  } = body;

  const message = `I have an educational app that makes spelling vocabulary 
lists for elementary students. For this task, you will generate 3 spelling
word group/categories from the following words: ${inspirations.join(", ")}. 
Remember the categories should be related to the words. Some examples of categories are:
- words with silent 'e'
- long 'a' sound words
- common verbs and adjectives
You must always only return in the JSON format: { "categories": ["category1", "category2", "category3"] }`;

  const llmResult = await callLLM<{
    categories: string[];
  }>(message);
  const { categories }: { categories: string[] } = llmResult;
  return new Response(JSON.stringify({ categories: categories }), {
    headers: { "Content-Type": "application/json" },
  });
}
