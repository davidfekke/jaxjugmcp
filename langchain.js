import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { ChatOpenAI } from "@langchain/openai";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { loadMcpTools } from "@langchain/mcp-adapters";

// Initialize the ChatOpenAI model
const model = new ChatOpenAI({ modelName: "gpt-4.1" });

// Set up the MCP client and transport
const transport = new StdioClientTransport({
  command: "node",
  args: ["index.js"],
});

const client = new Client({
  name: "aviation-weather-client",
  version: "1.0.0",
});

try {
  // Connect to the MCP server
  await client.connect(transport);

  // Load tools from the MCP server
  const tools = await loadMcpTools("aviation_weather", client, {
    throwOnLoadError: true,
    prefixToolNameWithServerName: false,
    additionalToolNamePrefix: "",
  });

  // Create and run the agent
  const agent = createReactAgent({ llm: model, tools });
  const agentResponse = await agent.invoke({
    messages: [{ role: "user", content: "What is aviation weather for KJAX" }],
  });
  console.log(agentResponse);
} catch (e) {
  console.error(e);
} finally {
  // Clean up the connection
  await client.close();
}
