import { ChatAnthropic } from "@langchain/anthropic";
import { JsonOutputParser, StringOutputParser } from "@langchain/core/output_parsers";

const model = new ChatAnthropic({
  model: "claude-3-5-sonnet-20240620",
  temperature: 0.95,
});

export async function callLLM<T extends Record<string, any>>(message: string) {
  const llmResult = await model.invoke(message);
  const parser = new JsonOutputParser<T>();
  try {
    const result = await parser.invoke(llmResult);
    return result;
  }
  catch (e) {
    console.error(e);
    const strParser = new StringOutputParser()
    const str = await strParser.invoke(llmResult)
    throw new Error(`Failed to parse LLM output. Original output: ${str}`);
  }
}
