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
