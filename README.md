# AI Chat Assistant

A modern, multi-provider AI chat application built with Next.js 15, the latest AI SDK, and shadcn/ui components.

## Features

- **Multi-Provider Support**: Chat with OpenAI, Anthropic, Google, and OpenRouter models
- **Latest AI SDK**: Built with AI SDK v5 for the best performance and features
- **Real-time Streaming**: Enjoy fast, streaming responses from AI models
- **Modern UI**: Beautiful interface built with shadcn/ui and Tailwind CSS
- **Tool Calling**: Ready for advanced AI agent capabilities (see examples below)
- **Responsive Design**: Works perfectly on desktop and mobile devices

## Latest AI SDK Features

This app is built with the latest AI SDK v5, which includes:

- **Streaming Text**: Real-time streaming responses using `streamText`
- **Tool Calling**: AI models can call functions to perform actions
- **Multi-Step Conversations**: Support for complex, multi-turn conversations
- **Unified Provider Interface**: Easy switching between different AI providers
- **Type Safety**: Full TypeScript support with proper type definitions

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- API keys for your preferred AI providers

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd chatai
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up your environment variables (optional, you can also add them in the UI):
```bash
# Create .env.local file
OPENAI_API_KEY=your_openai_key_here
ANTHROPIC_API_KEY=your_anthropic_key_here
GOOGLE_GENERATIVE_AI_API_KEY=your_google_key_here
```

4. Start the development server:
```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Basic Chat

1. Add your API keys in the settings (click the settings icon)
2. Select your preferred AI provider and model
3. Start chatting! The app will stream responses in real-time

### Advanced Features

#### Tool Calling

The app is ready for tool calling capabilities. To enable tools, uncomment the tool section in `app/api/chat/route.ts`:

```typescript
// Example tool implementation
tools: {
  getCurrentTime: tool({
    description: 'Get the current date and time',
    inputSchema: z.object({}),
    execute: async () => {
      return { currentTime: new Date().toISOString() };
    },
  }),
},
```

#### Multi-Step Conversations

Enable multi-step conversations by uncommenting:

```typescript
stopWhen: stepCountIs(5),
```

This allows the AI to make multiple tool calls in sequence to complete complex tasks.

## Supported Models

### OpenAI
- GPT-4o (latest)
- GPT-4o Mini
- GPT-4 Turbo
- GPT-3.5 Turbo

### Anthropic
- Claude 3.5 Sonnet (with Computer Use capabilities)
- Claude 3.5 Haiku
- Claude 3 Opus
- Claude 3 Sonnet

### Google
- Gemini 2.5 Pro
- Gemini 2.5 Flash
- Gemini 2.0 Flash
- Gemini 1.5 Pro
- Gemini 1.5 Flash

### OpenRouter
- Various open-source models (free tier available)

## Architecture

The app follows modern Next.js 15 patterns:

- **App Router**: Uses the latest Next.js App Router
- **Server Actions**: API routes for AI interactions
- **Context Providers**: React Context for state management
- **Custom Hooks**: Reusable logic for chat and settings
- **TypeScript**: Full type safety throughout the application

## Key Components

- `Chat`: Main chat interface with streaming support
- `ModelSelector`: Provider and model selection
- `Settings`: API key management
- `ChatMessage`: Individual message display
- `ChatInput`: Message input with send functionality

## Customization

### Adding New Tools

To add new tools, extend the tools object in the chat route:

```typescript
tools: {
  yourTool: tool({
    description: 'Description of what your tool does',
    inputSchema: z.object({
      // Define your input schema
    }),
    execute: async (input) => {
      // Implement your tool logic
      return { result: 'your result' };
    },
  }),
},
```

### Adding New Providers

To add new AI providers:

1. Add the provider to the `ModelProvider` enum in `lib/types.ts`
2. Add the provider package to `package.json`
3. Update the provider configuration in `app/api/chat/route.ts`
4. Add models to `lib/models.ts`

## Deployment

The app is ready for deployment on Vercel:

```bash
pnpm build
vercel --prod
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Built with [AI SDK](https://sdk.vercel.ai/) by Vercel
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Powered by Next.js 15
