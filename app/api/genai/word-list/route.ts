import { streamLLM } from "@/lib/llm";

export async function POST(request: Request) {
  try {
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

    console.log("Word list generation request:", { examples, category, n });

    const message = `I have an educational app that makes spelling vocabulary
lists for elementary students. For this task, you will generate ${n} words that fall
under the category: ${category}.
Some examples of words in this category are: ${examples.join(", ")}.
You must also think of an exemplar sentence for each word.
You must include the example words in your list.

IMPORTANT: You must output each word ONE AT A TIME in the following format:
{"word": "word1", "exemplarUsage": "sentence1"}
{"word": "word2", "exemplarUsage": "sentence2"}
...

Each line should be a separate JSON object. Do NOT wrap them in an array.`;

    console.log("Calling LLM with streaming");

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of streamLLM(message)) {
            const data = `data: ${JSON.stringify({ chunk: chunk.toString() })}\n\n`;
            controller.enqueue(encoder.encode(data));
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (error) {
          console.error("Stream error:", error);
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error in word-list generation API:", error);

    return new Response(
      JSON.stringify({
        error: "Failed to generate word list",
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
