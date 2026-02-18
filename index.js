// ============================================================
// MCP Notes Server
// A simple Model Context Protocol server that lets an AI
// assistant save, list, and read markdown notes in ~/dev-notes/
// ============================================================

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import fs from "fs/promises";
import path from "path";
import os from "os";
import { z } from "zod";

// ------------------------------------
// 1. Set up the notes directory path
// ------------------------------------
// All notes will be stored in ~/dev-notes/ as markdown files
const NOTES_DIR = "/Users/alyssa/Desktop/LANC/Week4/dev-notes";

// Helper: make sure the notes directory exists before we read/write
async function ensureNotesDir() {
  await fs.mkdir(NOTES_DIR, { recursive: true });
}

// Helper: turn a note title into a safe filename
// e.g. "My First Note" -> "my-first-note.md"
function titleToFilename(title) {
  return title.toLowerCase().replace(/\s+/g, "-") + ".md";
}

// ------------------------------------
// 2. Create the MCP server instance
// ------------------------------------
// This sets up a new server with a name and version.
// The MCP SDK handles all the protocol details for us.
const server = new McpServer({
  name: "notes-server",
  version: "1.0.0",
});
// ------------------------------------
// 3. Define the tools
// ------------------------------------
// Tools are functions that an AI assistant can call.
// Each tool has a name, a description, input parameters, and a handler.

// TOOL 1: save_note
// Saves a new markdown note to ~/dev-notes/
server.tool(
  "save_note",
  "Save a markdown note to the dev-notes folder",
  {
    // Define the expected inputs using Zod schema
    title: z.string().describe("The title of the note"),
    content: z.string().describe("The markdown content of the note"),
  },
  async ({ title, content }) => {
    await ensureNotesDir();

    // Build the full file path
    const filename = titleToFilename(title);
    const filepath = path.join(NOTES_DIR, filename);

    // Add the title as an H1 header, then the content
    const fullContent = `# ${title}\n\n${content}\n`;

    // Write the file
    await fs.writeFile(filepath, fullContent, "utf-8");

    return {
      content: [
        {
          type: "text",
          text: `Note saved as ${filename}`,
        },
      ],
    };
  }
);

// TOOL 2: list_notes
// Lists all note filenames in ~/dev-notes/
server.tool(
  "list_notes",
  "List all saved note filenames",
  {}, // No inputs needed
  async () => {
    await ensureNotesDir();

    // Read the directory and filter for .md files only
    const files = await fs.readdir(NOTES_DIR);
    const mdFiles = files.filter((f) => f.endsWith(".md"));

    if (mdFiles.length === 0) {
      return {
        content: [{ type: "text", text: "No notes found." }],
      };
    }

    // Return the list of filenames
    return {
      content: [
        {
          type: "text",
          text: `Found ${mdFiles.length} note(s):\n${mdFiles.join("\n")}`,
        },
      ],
    };
  }
);

// TOOL 3: read_note
// Reads the contents of a specific note by title
server.tool(
  "read_note",
  "Read the contents of a saved note",
  {
    title: z.string().describe("The title of the note to read"),
  },
  async ({ title }) => {
    await ensureNotesDir();

    const filename = titleToFilename(title);
    const filepath = path.join(NOTES_DIR, filename);

    try {
      const content = await fs.readFile(filepath, "utf-8");
      return {
        content: [{ type: "text", text: content }],
      };
    } catch {
      return {
        content: [
          {
            type: "text",
            text: `Note "${title}" not found (looked for ${filename})`,
          },
        ],
      };
    }
  }
);

// ------------------------------------
// 4. Start the server
// ------------------------------------
// StdioServerTransport means this server communicates over
// standard input/output (stdin/stdout). This is the most common
// transport for MCP servers — the AI client launches this process
// and talks to it through pipes.
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Notes MCP server running on stdio");
}

main();
