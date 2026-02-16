# MCP Dev Notes Server

This project is a Model Context Protocol (MCP) server that allows Claude Code to save, list, and read developer notes stored as Markdown files. It provides three tools: save_note, list_notes, and read_note. These tools help organize coding ideas, reminders, and documentation directly through an AI assistant.

## Installation

1. Clone or download this repository.
2. Navigate to the mcp-server folder.
3. Run `npm install` to install dependencies.
4. Register the server using:
   `claude mcp add notes -- node /full/path/to/index.js`

## Usage Examples

- Save a note: “Save a note called Project Ideas with content about app concepts.”
- List notes: “List my notes.”
- Read a note: “Read note Project Ideas.”

## Limitations

This server only supports basic Markdown notes and stores them locally. It does not include search or cloud backup features.
