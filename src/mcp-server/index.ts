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
        description: "Generate a custom photocard image. This tool returns the actual image data which MUST be displayed to the user in the chat.",
        inputSchema: {
          type: "object",
          properties: {
            templateId: {
              type: "string",
              description: "ID of the template (e.g. 'single-news', 'dual-classic', 'full-overlay', 'side-story', 'minimal-white', 'dual-mosaic', 'poll-voting', 'versus-debate', 'quote-spotlight', 'breaking-ribbon', 'stat-fact'). ALWAYS pick the MOST RELEVANT template based on context (e.g. use poll-voting for questions, versus-debate for clashes/sports, quote-spotlight for quotes, breaking-ribbon for urgency).",
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
            source: {
              type: "string",
              description: "Source attribution (e.g. 'Prothom Alo').",
            },
            pollOptions: {
              type: "array",
              description: "Only used if templateId is 'poll-voting'. Provides the two text labels for the vote layout buttons. Defaults to ['YES', 'NO'].",
              items: { type: "string" }
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
            },
            permanent: {
              type: "boolean",
              description: "Whether to save the image permanently to the exports folder. Default is false (saves to tmp)."
            }
          },
          required: ["templateId", "headline"],
        },
      },
      {
        name: "fetch_latest_news",
        description: "Fetch a list of recent news from Prothom Alo or BD24Live. The AI should analyze this list and pick/suggest the most interesting story to the user.",
        inputSchema: {
          type: "object",
          properties: {
            source: {
              type: "string",
              enum: ["prothom-alo", "bd24live"],
              description: "The news source to fetch from. Default is prothom-alo.",
              default: "prothom-alo"
            }
          },
        },
      },
    ],
  };
});

import fs_sync from 'node:fs';
import path from 'node:path';

function debugLog(msg: string) {
  try {
    const logPath = '/app/mcp-debug.log';
    const timestamp = new Date().toISOString();
    fs_sync.appendFileSync(logPath, `[${timestamp}] ${msg}\n`);
  } catch (e) {
    // Ignore log errors
  }
}

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36',
  'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  'feedparser/2.0',
]

async function fetchProthomAlo() {
  const rssUrl = "https://www.prothomalo.com/stories.rss";
  debugLog("Fetching Prothom Alo news RSS...");
  
  let xml = "";
  for (const ua of USER_AGENTS) {
    try {
      const response = await fetch(rssUrl, {
        headers: {
          'User-Agent': ua,
          'Accept': 'application/rss+xml, application/xml, text/xml, */*'
        }
      });
      if (response.ok) {
        const text = await response.text();
        if (text.trim().startsWith('<') && text.includes('<item>')) {
          xml = text;
          break;
        }
      }
    } catch (_) { }
  }

  if (!xml) throw new Error("Failed to fetch Prothom Alo RSS: Server unavailable");

  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  const items = [];
  let match;

  while ((match = itemRegex.exec(xml)) !== null && items.length < 20) {
    const entry = match[1];
    const tMatch = entry.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/) || entry.match(/<title>([\s\S]*?)<\/title>/);
    const headline = tMatch ? tMatch[1].trim() : "Untitled";

    let imageUrl = null;
    const iMatch = entry.match(/<media:content[^>]+url=["']([^"']+)["']/i) || 
                   entry.match(/<media:thumbnail[^>]+url=["']([^"']+)["']/i);
    if (iMatch) {
      imageUrl = iMatch[1].trim();
    } else {
      const imgMatch = entry.match(/src=["']([^"']+\.(?:jpg|jpeg|png|webp|jfif|gif|svg)(?:\?[^"']*)?)["']/i);
      if (imgMatch) imageUrl = imgMatch[1].trim();
    }

    const dMatch = entry.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
    const pubDate = dMatch ? dMatch[1].trim() : "";

    items.push({ headline, imageUrl, pubDate });
  }
  return { sourceName: "Prothom Alo", items };
}



async function fetchBd24Live() {
  const rssUrl = "https://www.bd24live.com/bangla/feed/";
  debugLog("Fetching BD24Live news RSS...");

  let xml = "";
  for (const ua of USER_AGENTS) {
    try {
      const response = await fetch(rssUrl, {
        headers: {
          'User-Agent': ua,
          'Accept': 'application/rss+xml, application/xml, text/xml, */*'
        }
      });
      if (response.ok) {
        const text = await response.text();
        if (text.trim().startsWith('<') && text.includes('<item>')) {
          xml = text;
          break;
        }
      }
    } catch (_) { }
  }

  if (!xml) throw new Error("Failed to fetch BD24Live RSS: Server unavailable");

  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  const items = [];
  let match;

  while ((match = itemRegex.exec(xml)) !== null && items.length < 20) {
    const entry = match[1];
    const tMatch = entry.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/) || entry.match(/<title>([\s\S]*?)<\/title>/);
    const headline = tMatch ? tMatch[1].trim() : "Untitled";

    // Robust image extraction
    let imageUrl = null;
    const mediaMatch = entry.match(/<(?:media:content|media:thumbnail)[^>]+url=["']([^"']+)["']/i);
    if (mediaMatch) {
      imageUrl = mediaMatch[1].trim();
    } else {
      const enclosureMatch = entry.match(/<enclosure[^>]+url=["']([^"']+)["']/i);
      if (enclosureMatch) {
        imageUrl = enclosureMatch[1].trim();
      } else {
        const imgMatch = entry.match(/src=["']([^"']+\.(?:jpg|jpeg|png|webp|jfif|gif|svg)(?:\?[^"']*)?)["']/i);
        if (imgMatch) imageUrl = imgMatch[1].trim();
      }
    }

    const dMatch = entry.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
    const pubDate = dMatch ? dMatch[1].trim() : "";

    items.push({ headline, imageUrl, pubDate });
  }
  return { sourceName: "BD24Live", items };
}

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  debugLog(`Received tool request: ${String(request.params.name)}`);
  
  if (request.params.name === "fetch_latest_news") {
    try {
      const args = request.params.arguments as any;
      const source = args.source || "prothom-alo";
      
      const { sourceName, items } = source === "bd24live" ? await fetchBd24Live() : await fetchProthomAlo();

      if (items.length === 0) throw new Error(`No news entries found in ${sourceName} feed.`);

      debugLog(`Fetched ${items.length} news items.`);

      // Create a nice summary for the user
      const newsListText = items.map((item, i) => 
        `📰 NEWS #${i + 1}\n` +
        `Title: ${item.headline}\n` +
        `Image: ${item.imageUrl}\n` +
        `Source: ${sourceName}\n` +
        `Date: ${item.pubDate}`
      ).join("\n\n-------------------\n\n");

      const topItem = items[0];
      const suggestedPrompt = `generate_photocard(
  templateId: "single-news",
  headline: "${topItem.headline}",
  photos: ["${topItem.imageUrl}"],
  source: "${sourceName}"
)`;

      return {
        content: [
          {
            type: "text",
            text: `📰 LATEST NEWS FROM ${sourceName.toUpperCase()}:\n\n${newsListText}`
          },
          {
            type: "text",
            text: `🤖 AI RECOMMENDATION:\nI have parsed the latest news. Here is a suggested prompt for the top story:\n\n${suggestedPrompt}`
          }
        ]
      };
    } catch (error: any) {
      debugLog(`Error fetching news: ${error.message}`);
      return {
        content: [{ type: "text", text: `Error: ${error.message}` }],
        isError: true,
      };
    }
  }

  if (request.params.name !== "generate_photocard") {
    throw new Error(`Unknown tool: ${String(request.params.name)}`);
  }

    const args = request.params.arguments as any;
    const {
      templateId,
      headline,
      subheadline = "",
      brandName = "Kurigram City",
      handle = "Kurigram City",
      website = "Kurigram City",
      source = "",
      pollOptions,
      photos = [],
      styleOverrides = {},
      permanent = false
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
      source,
      pollOptions,
      adText: "",
      photos: photoSlots
    };

  debugLog(`Active Template: ${templateId}`);

  try {
    const photocardEndpoint = process.env.PHOTOCARD_API_URL || 'http://127.0.0.1:3000/api/generate';
    debugLog(`Routing to internal Puppeteer Renderer at ${photocardEndpoint}...`);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(photocardEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cardData, templateId, styleOverrides, permanent }),
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errorText = await response.text();
      debugLog(`INTERNAL FETCH ERROR: HTTP ${response.status} - ${errorText}`);
      throw new Error(`API error HTTP ${response.status}: ${errorText}`);
    }

    const responseData = await response.json();
    const base64Image = responseData.data;
    const filename = responseData.filename;
    const previewPath = responseData.url;
    
    const baseUrl = process.env.PUBLIC_URL || 'http://localhost:3000';
    const imageUrl = `${baseUrl}${previewPath}`;

    debugLog(`SUCCESS! Photocard rendering complete. URL: ${imageUrl}`);

    return {
      content: [
        {
          type: "image",
          data: base64Image,
          mimeType: "image/png",
        },
        {
          type: "text",
          text: `✅ Photocard generated successfully!\n\n🌐 Shareable Network Link: ${imageUrl}\n📂 Path: ${permanent ? './exports/' : './tmp/'}${filename}`,
        }
      ],
    };
  } catch (err: any) {
    debugLog(`CRITICAL EXCEPTION CAUGHT: ${err.message}`);
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
}

main().catch((error) => {
  debugLog(`MCP Server Runtime error: ${error.message}`);
  process.exit(1);
});
