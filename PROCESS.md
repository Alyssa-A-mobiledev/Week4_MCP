## What I Built

I built an MCP server using Node.js and the Model Context Protocol SDK that allows Claude Code to manage developer notes. The server provides three tools: save_note, list_notes, and read_note. Notes are saved as a files in a local folder inside the project. I chose this design because it is simple, useful, and easy to understand.

## How Claude Code Helped

Claude Code helped me generate the initial server structure and tool definitions. For example, I used the prompt “Create a simple MCP server with tools for saving and reading notes” to generate the base code. Another helpful prompt was asking Claude to fix file path errors when my notes were not saving correctly.

## Debugging Journey

I encountered a few errors. One issue was when the server.tool function was not recognized. I resolved this by adjusting my imports and following the SDK documentation. I also had path errors when Node could not find index.js, which I fixed by navigating to the correct folder.

## How MCP Works

MCP servers communicate with AI clients using standard input and output. The client launches the server as a subprocess and sends structured JSON requests. The server processes these requests and returns responses. Each tool is registered with a schema that defines its inputs and outputs.

## What I’d Do Differently

If I were to redo this project, I would set up the file structure more carefully at the beginning and test each step earlier.
