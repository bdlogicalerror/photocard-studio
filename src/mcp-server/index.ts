import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { Buffer } from "node:buffer";

const server = new Server(
  {
    name: "photocard-studio-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "generate_photocard",
        description: "Generate a custom photocard image using the Photocard Studio Next.js server.",
        inputSchema: {
          type: "object",
          properties: {
            templateId: {
              type: "string",
              description: "ID of the template (e.g. 'dual-classic', 'single-news', 'full-overlay', 'side-story', 'minimal-white', 'dual-mosaic').",
            },
            headline: {
              type: "string",
            },
            subheadline: {
              type: "string",
            },
            brandName: {
              type: "string",
            },
            handle: {
              type: "string",
            },
            website: {
              type: "string",
            },
            photos: {
              type: "array",
              description: "Array of photo URLs. Order matters depending on the template. Example: ['https://example.com/photo1.jpg']",
              items: { type: "string" }
            },
            styleOverrides: {
              type: "object",
              description: "Optional styling parameters to completely customize the template's look. Equivalent to EditorPanel controls.",
              properties: {
                accentColor: { type: "string" },
                backgroundColor: { type: "string" },
                headlineColor: { type: "string" },
                subheadlineColor: { type: "string" },
                brandBarBg: { type: "string" },
                brandColor: { type: "string" },
                photoDividerColor: { type: "string" },
                headlineFontSize: { type: "number" },
                subheadlineFontSize: { type: "number" },
                headlineFontWeight: { type: "number", enum: [400, 700, 900] },
                fontFamily: { type: "string", enum: ["bengali", "bengali-sans", "display", "sans"] },
                accentBarHeight: { type: "number" },
                accentBarPosition: { type: "string", enum: ["top", "bottom", "none"] },
                overlayOpacity: { type: "number", description: "Opacity from 0 to 1" },
                borderRadius: { type: "number" },
                padding: { type: "number" },
                showBrandBar: { type: "boolean" }
              }
            }
          },
          required: ["templateId", "headline"],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  console.error(`[MCP] Received tool request: ${String(request.params.name)}`);
  if (request.params.name !== "generate_photocard") {
    throw new Error(`Unknown tool: ${String(request.params.name)}`);
  }

  const args = request.params.arguments as any;
  const {
    templateId,
    headline,
    subheadline = "",
    brandName = "anwar tv",
    handle = "anwartvnews",
    website = "anwartv.news",
    photos = [],
    styleOverrides = {}
  } = args;

  const photoSlots = [];
  for (let i = 0; i < 3; i++) {
     photoSlots.push({
       id: `p${i+1}`,
       src: (photos && photos.length > 0) ? (photos[i%photos.length] || null) : null,
       objectPosition: 'center',
       objectFit: 'cover',
       scale: 1
     });
  }

  const cardData = {
    headline,
    subheadline,
    brandName,
    handle,
    website,
    adText: "",
    photos: photoSlots
  };

  console.error(`[MCP] Active Template: ${templateId}`);
  console.error(`[MCP] Headline: "${headline}"`);
  console.error(`[MCP] Photos provided: ${photoSlots.filter(p => !!p.src).length}`);
  if (Object.keys(styleOverrides).length > 0) {
    console.error(`[MCP] Detected Style Overrides: ${JSON.stringify(Object.keys(styleOverrides))}`);
  }

  try {
    const photocardEndpoint = process.env.PHOTOCARD_API_URL || 'http://127.0.0.1:3000/api/generate';
    console.error(`[MCP] Routing to internal Puppeteer Renderer at ${photocardEndpoint}...`);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(photocardEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cardData, templateId, styleOverrides }),
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[MCP] INTERNAL FETCH ERROR: HTTP ${response.status} - ${errorText}`);
      throw new Error(`API error HTTP ${response.status}: ${errorText}`);
    }

    const buffer = await response.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString('base64');
    
    console.error(`[MCP] SUCCESS! Photocard rendering complete (${base64Image.length} bytes base64). Delivering payload to OpenClaw...`);

    return {
      content: [
        {
          type: "image",
          data: base64Image,
          mimeType: "image/png",
        },
        {
          type: "text",
          text: `Successfully generated photocard with template '${templateId}'.`,
        }
      ],
    };
  } catch (err: any) {
    console.error(`[MCP] CRITICAL EXCEPTION CAUGHT: ${err.message}`);
    return {
      content: [
        {
          type: "text",
          text: `Error generating photocard: ${err.message}`,
        },
      ],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Photocard Studio MCP Server running on stdio");
}

main().catch((error) => {
  console.error("MCP Server Server error:", error);
  process.exit(1);
});
