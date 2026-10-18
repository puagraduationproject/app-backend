# Training example format

> From [technical-structure.md](https://github.com/puagraduationproject/graduationproject/blob/main/technical-structure.md) section 6.10. When the design changes, this page changes with it.

Shared by `app-ai-agent` and `app-ai-model`. The AI team owns the format; the
backend keeps it here so every repo reads the same one.

One example = the request, the skill if any, the tool calls with their inputs,
the tool results, and the final answer. Personal data removed.

The tool names, inputs and outputs in examples come from the
[tool reference](../tools/README.md). When a tool gets a new version, examples
that use the old one are marked.
