import { callLLM } from "@/lib/llm";

export async function POST(request: Request) {
  const body = await request.json();

  const {
    word,
  }: {
    word: string;
  } = body;

  const message = `I have an educational app that makes spelling vocabulary 
    lists for elementary students. For this task, you will provide a tip to help the student
    to better remember a word they have trouble with: ${word}.
    You must always only return in the JSON format: { "tip": (a tip that can help student memorize the word) }`;

  const llmResult = await callLLM<{
    tip: string;
  }>(message);
  const { tip } = llmResult;
  return new Response(JSON.stringify({ tip: tip }), {
    headers: { "Content-Type": "application/json" },
  });
}
