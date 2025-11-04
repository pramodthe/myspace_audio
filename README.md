# AI Music Generator

A modern, frontend-only music player application built with React and Vite. Features a retro-styled music player with AI-inspired demo functionality.

## Features

- 🎵 **Music Player**: Full-featured audio player with play/pause, volume control, and track display
- 🎨 **Retro Theme**: Classic MySpace-inspired design with customizable themes
- 📝 **Song Generator**: Demo functionality that simulates AI music generation
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
cd ai-music-generator
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the project for production
- `npm run preview` - Preview the production build locally

## Project Structure

```
src/
├── components/           # React components
│   ├── ConfigurableMusicPlayer.tsx
│   └── MusicPlayer/     # Music player components
├── types/               # TypeScript type definitions
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

## Demo Features

Since this is a frontend-only application, the "AI generation" features are simulated:

- **AI Lyrics**: Provides sample lyrics from a predefined set
- **Music Generation**: Uses demo tracks to simulate AI-generated music
- **Track Management**: Full playlist functionality with add/remove capabilities

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).