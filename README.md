# AI Voice Persona Platform 🎙️

A real-time, bidirectional voice conversational platform that allows users to talk to AI personas in a natural, low-latency, voice-first interface. This application is built with modern Web technologies, originally leveraging the Gemini API's WebSocket connection for seamless audio-to-audio experiences.

## Features ✨

- **Real-time Voice Conversation:** Seamless bidirectional audio stream with AI personas.
- **Multiple Personas:** Users can select and interact with different AI characters, each with unique system prompts and simulated emotional states.
- **Leveling & User Profiles:** Built-in persistence for user profiles, call durations, and a simplified leveling system to gamify the experience.
- **Modern UI:** Built with React, TailwindCSS, and Lucide React icons, featuring a sleek, dark-mode, glassmorphic UI.
- **I18n Context:** Built-in multi-language architectural support.

## Tech Stack 🛠️

- **Frontend:** React 19, TypeScript
- **Bundler:** Vite
- **Styling:** Tailwind CSS (v4), `clsx`, `tailwind-merge`
- **Audio Integration:** Web Audio API (`AudioContext`, `ScriptProcessorNode`/`AudioWorklet`, `MediaDevices`)

## Installation & Setup 🚀

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set your environment variables (e.g., Gemini API key if required). You can create a `.env` file at the root.
   ```
   VITE_GEMINI_API_KEY=your-api-key-here
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Architecture

The project revolves around standard React patterns with an entry point in `main.tsx` and routing/state simulated in `App.tsx`. 

Important Hooks & Components:
- `useGeminiAudio.ts`: Manages the WebSocket connection to Gemini's BidiGenerateContent endpoint, captures microphone inputs using `AudioContext`, encodes PCM data to Base64, and queues server audio chunks to play.
- **Components:** Modularized screens for `Home`, `Call`, `Explore`, `Profile`, and `PostCall`.

## Troubleshooting Gemini Live API 🔧

If you are developing or forking this project and run into WebSocket or Live API audio dropping issues, reference the following fixes that were implemented in `useGeminiAudio.ts`:

1. **WebSocket Dropping (Race Condition):** Ensure the audio streams and client initial prompts are NOT fired directly inside the WebSocket `onopen` callback. The Gemini backend takes a few milliseconds to prepare the session. Wait for the `message.setupComplete` payload before initializing transmission.
2. **Silent Audio Transmission Failures:** The SDK typings expect `sendRealtimeInput` payloads to be a direct object (`{ media: { mimeType, data } }`), not an array object (`[{ mediaChunks: ... }]`). Passing the incorrect shape causes the SDK to silently drop packets without throwing an error, resulting in the AI ignoring user speech.
3. **Overlapping Audio (Interruptions):** Merely tracking `isSpeaking` isn't enough when the user interrupts the AI. The server responds with `interrupted: true`. The client must actively store `AudioBufferSourceNode` references in a tracker array, iterate, and call `.stop()` universally upon receiving this flag to forcefully flush audio buffers before the new generative run begins.