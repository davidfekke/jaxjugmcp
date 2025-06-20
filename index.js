import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Create an MCP server
const server = new McpServer({
  name: "Aviation Weather",
  description: "A server that provides aviation weather information.",
  version: "1.0.0"
});

server.tool("get_aviation_weather",
  "A tool to get aviation weather information in a METAR format",
  { location: z.string().length(4).describe("The ICAO code of the airport") },
  async ({ location }) => {
    // Simulate a weather API call
    const weatherApiResponse = await fetch(`https://avwx.fekke.com/metar/${location}`);
    const weatherData = await weatherApiResponse.json();
    return {
      content: [{
        type: "text",
        text: JSON.stringify(weatherData[0], null, 2)
      }]
    };
  }
);

server.tool("get_aviation_weather_forecast",
  "A tool to get aviation weather forecast information in a TAR (Terminal Area Forecast) format",
  { location: z.string().length(4).describe("The ICAO code of the airport") },
  async ({ location }) => {
    // Simulate a weather API call
    const weatherApiResponse = await fetch(`https://avwx.fekke.com/taf/${location}`);
    const weatherData = await weatherApiResponse.json();
    return {
      content: [{
        type: "text",
        text: JSON.stringify(weatherData[0], null, 2)
      }]
    };
  }
);

// Add a dynamic greeting resource
server.resource(
  "greeting",
  new ResourceTemplate("greeting://{name}", { list: undefined }),
  async (uri, { name }) => ({
    contents: [{
      uri: uri.href,
      text: `Hello, ${name}!`
    }]
  })
);

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);
