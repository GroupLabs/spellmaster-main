import { callLLM } from "@/lib/llm";

export async function POST(request: Request) {
  const body = await request.json();

  const {
    examples,
    category,
    n,
  }: {
    examples: string[];
    category: string;
    n: number;
    } = body;

  const message = `I have an educational app that makes spelling vocabulary 
lists for elementary students. For this task, you will generate ${n} words that fall
under the category: ${category}.
Some examples of words in this category are: ${examples.join(", ")}.
You must also think of an exemplar sentence for each word.
You must include the example words in your list.
You must always only return in the JSON format: { "wordList": [{ "word": "word1", "exemplarUsage": "sentence1" }, ...] }`;

  const llmResult = await callLLM<{
    wordList: { word: string; exemplarUsage: string }[];
  }>(message);
  const { wordList } = llmResult;
  return new Response(JSON.stringify({ wordList: wordList }), {
    headers: { "Content-Type": "application/json" },
  });
}
