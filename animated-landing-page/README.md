# SwiftSolve AI - Animated Landing Page

A stunning, modern landing page for **SwiftSolve AI** — a digital agency that builds interactive websites, UI/UX designs, WhatsApp bots, chatbot integrations, and AI solutions for modern businesses.

![React](https://img.shields.io/badge/React-19.1.1-blue) ![Vite](https://img.shields.io/badge/Vite-7.1.7-646CFF) ![Three.js](https://img.shields.io/badge/Three.js-0.180.0-black) ![GSAP](https://img.shields.io/badge/GSAP-3.13.0-green) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.13-38B2AC)

## Features

- **Immersive Hero Section** - Video background with smooth animations
- **3D Product Visualization** - Interactive 3D MacBook models using Three.js
- **What We Offer Section** - Scroll-synced feature highlights with video on MacBook screen
- **Highlights Section** - Why businesses choose SwiftSolve AI
- **Showcase Section** - Stats and company overview with pinned scroll animation
- **Contact Us Section** - Name and email form with animated success state
- **Smooth Animations** - GSAP-powered scroll-triggered animations
- **Fully Responsive** - Optimized for all devices and screen sizes

## Tech Stack

### Core Technologies
- **React 19** - Latest React with modern hooks and features
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS 4** - Utility-first CSS framework
- **GSAP** - Professional-grade animation library
- **Three.js** - 3D graphics library for WebGL
- **React Three Fiber** - React renderer for Three.js
- **Zustand** - Lightweight state management

### Key Libraries
- `@react-three/drei` - Useful helpers for React Three Fiber
- `@gsap/react` - GSAP hooks for React
- `react-responsive` - Media queries for React
- `clsx` - Utility for constructing className strings

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn package manager

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/swiftsolve-ai-landing.git
cd swiftsolve-ai-landing
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:3005`

### Build for Production

```bash
npm run build
# or
yarn build
```

The production-ready files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
# or
yarn preview
```

## Project Structure

```
animated-landing-page/
├── public/
│   ├── videos/             # Hero and feature videos
│   ├── models/             # 3D GLB model files
│   └── logo.jpeg           # SwiftSolve AI logo
├── src/
│   ├── components/         # React components
│   │   ├── CarLandingSection.jsx
│   │   ├── Features.jsx
│   │   ├── Footer.jsx
│   │   ├── Hero.jsx
│   │   ├── Highlights.jsx
│   │   ├── NavBar.jsx
│   │   ├── Showcase.jsx
│   │   ├── Waitlist.jsx
│   │   └── models/         # 3D model components
│   ├── constants/          # Navigation links, features, and config
│   ├── store/              # Zustand state management
│   ├── App.jsx             # Main application component
│   ├── index.css           # Global styles and Tailwind config
│   └── main.jsx            # Application entry point
├── index.html              # HTML template
├── vite.config.js          # Vite configuration
└── package.json            # Project dependencies
```

## Key Components

### NavBar
Navigation bar with links: Home, Highlights, Contact Us, What We Offer — with Login and Sign Up buttons.

### Hero Section
Full-screen video background with the headline "Welcome to SwiftSolve AI" and tagline "We Turn Ideas Into Powerful Digital Products".

### Showcase Section
Pinned scroll section presenting SwiftSolve AI's core identity, with stats — 50+ projects delivered and 100% client satisfaction.

### What We Offer (Features) Section
Scroll-synced 3D MacBook model that rotates and plays feature videos, paired with animated feature cards for each service:
- Interactive Website
- UI/UX Design
- WhatsApp Bots
- Chatbot Integration
- AI Solutions

### Highlights Section
Masonry grid showcasing why businesses choose SwiftSolve AI — Fast Delivery, Affordable Pricing, Custom Built, and 24/7 Support.

### Contact Us Section
A clean vertical form collecting name and email with animated success feedback.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## License

This project is private and proprietary.

---

**SwiftSolve AI** - We Build What Your Business Needs Next
