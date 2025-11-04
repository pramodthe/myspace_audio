# AI MusicBox

A modern music player application with AI-powered audio generation capabilities. Features a retro-styled interface with real backend integration for generating and managing audio files.

## Features

- 🎵 **Music Player**: Full-featured audio player with play/pause, volume control, and track display
- 🎨 **Retro Theme**: Classic MySpace-inspired design with customizable themes
- 🤖 **AI Audio Generation**: Real AI-powered music generation via backend API
- 📚 **Audio Library**: Manage and browse all generated audio files
- 🗑️ **File Management**: Delete unwanted audio files
- 📊 **Statistics**: View audio library statistics
- 📱 **Responsive Design**: Works on desktop and mobile devices
- ⚡ **Fast Development**: Built with Vite for lightning-fast development experience

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd myspace_frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment (optional):
```bash
cp .env.example .env
# Edit .env to set your API base URL if different from http://localhost:8000
```

4. Make sure the backend is running on `http://localhost:8000`

5. Start the development server:
```bash
npm run dev
```

6. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the project for production
- `npm run preview` - Preview the production build locally

## Project Structure

```
src/
├── components/           # React components
│   ├── ConfigurableMusicPlayer.tsx
│   ├── AudioLibrary.tsx
│   ├── ErrorBoundary.tsx
│   └── MusicPlayer/     # Music player components
├── services/            # API services
│   └── audioApi.ts     # Backend API integration
├── hooks/              # Custom React hooks
│   └── useAudioApi.ts  # Audio API management hook
├── config/             # Configuration files
│   └── api.ts          # API configuration
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
├── index.css           # Global styles
└── vite-env.d.ts       # Vite environment types

public/
└── vite.svg           # Application icon
```

## Technologies Used

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **CSS Modules** - Component-scoped styling

## Backend Integration

This application integrates with a Python backend API for real audio generation:

### API Endpoints
- `POST /generate-audio` - Generate audio from music details and lyrics
- `GET /audio-files` - List all generated audio files
- `GET /audio-details/{file_id}` - Get detailed file information
- `GET /download-audio/{file_id}` - Download/stream audio files
- `DELETE /delete-audio/{file_id}` - Delete audio files
- `GET /audio-stats` - Get audio library statistics

### Features
- **Real AI Generation**: Connects to backend AI models for music generation
- **File Management**: Upload, download, and delete audio files
- **Error Handling**: Graceful handling of API errors and network issues
- **Offline Fallback**: Demo tracks available when backend is unavailable

For detailed API integration information, see [API_INTEGRATION.md](./API_INTEGRATION.md).

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).