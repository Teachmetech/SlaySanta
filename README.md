# 🎅 SlaySanta - Secret Santa Organizer

A modern, mobile-first web application for organizing Secret Santa events with friends, family, and colleagues. Built with React, TypeScript, Tailwind CSS, and Convex.

![SlaySanta Preview](https://via.placeholder.com/800x400/dc2626/ffffff?text=SlaySanta+Preview)

## ✨ Features

- **📱 Mobile-First Design**: Optimized for all devices with responsive design
- **🎨 Festive Theme**: Beautiful red/green holiday colors with dark/light mode support
- **🔐 Simple Authentication**: Email-based auth (demo mode available)
- **🎄 Event Management**: Create and manage multiple Secret Santa events
- **👥 Participant Management**: Invite via email or share join codes
- **🎲 Automatic Pairing**: Fair, random Secret Santa assignments
- **💬 Built-in Chat**: Coordinate with participants in real-time
- **📝 Wishlist Support**: Share gift preferences easily
- **⚡ Real-time Updates**: Powered by Convex backend
- **🧪 Well Tested**: Comprehensive test suite with Vitest

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or pnpm
- Convex account (free at [convex.dev](https://convex.dev))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SlaySanta
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Convex**
   ```bash
   npm run convex:dev
   ```
   This will:
   - Create a new Convex project
   - Generate `.env.local` with your deployment URL
   - Start the Convex development server

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🛠 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage
- `npm run convex:dev` - Start Convex development
- `npm run convex:deploy` - Deploy to Convex

### Project Structure

```
SlaySanta/
├── convex/                 # Backend functions and schema
│   ├── schema.ts          # Database schema
│   ├── events.ts          # Event management functions
│   ├── participants.ts    # Participant functions
│   ├── assignments.ts     # Secret Santa pairing logic
│   └── messages.ts        # Chat functionality
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── ui/           # Base UI components
│   │   └── Layout.tsx    # Main layout component
│   ├── pages/            # Page components
│   │   ├── HomePage.tsx  # Landing page
│   │   ├── AuthPage.tsx  # Authentication
│   │   └── DashboardPage.tsx
│   ├── hooks/            # Custom React hooks
│   │   ├── useAuth.tsx   # Authentication logic
│   │   └── useTheme.tsx  # Theme management
│   ├── lib/              # Utilities and configuration
│   │   ├── convex.ts     # Convex client setup
│   │   └── utils.ts      # Helper functions
│   └── types/            # TypeScript type definitions
├── public/               # Static assets
└── tests/               # Test configuration
```

### Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Backend**: Convex (serverless)
- **Routing**: React Router v6
- **Testing**: Vitest, React Testing Library
- **Build Tool**: Vite
- **Linting**: ESLint

## 🎨 Design System

### Colors

- **Festive Red**: Primary brand color (`#dc2626`)
- **Festive Green**: Secondary color (`#16a34a`) 
- **Festive Gold**: Accent color (`#f59e0b`)
- **Grays**: Neutral colors for text and backgrounds

### Components

All components follow a consistent design pattern:
- Mobile-first responsive design
- Dark/light mode support
- Accessible with ARIA labels
- Smooth animations and transitions

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
npm run test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### Test Coverage

- ✅ UI Components (Button, Card, Modal, etc.)
- ✅ Convex Functions (Events, Participants, Assignments)
- ✅ Custom Hooks (useAuth, useTheme)
- ✅ Utilities and helpers

## 🚀 Deployment

### Deploy to Vercel

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy Convex backend**
   ```bash
   npm run convex:deploy
   ```

3. **Deploy to Vercel**
   ```bash
   npx vercel --prod
   ```

### Deploy to Netlify

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   ```bash
   npx netlify deploy --prod --dir=dist
   ```

### Environment Variables

Make sure to set these in your deployment platform:

- `VITE_CONVEX_URL` - Your Convex deployment URL
- `CONVEX_DEPLOYMENT` - Your Convex deployment name

## 📱 Usage Guide

### Creating an Event

1. Sign up/Login with your email
2. Click "Create New Event" on the dashboard
3. Fill in event details:
   - Event name
   - Date
   - Budget (optional)
   - Description (optional)
4. Share the join code with participants

### Joining an Event

1. Get the join code from the organizer
2. Enter the code on the join page
3. Fill in your details and wishlist
4. Wait for the organizer to draw pairs

### Drawing Pairs

1. As an organizer, go to your event
2. Ensure all participants have joined
3. Click "Draw Pairs" 
4. Participants will be notified of their assignments

### Chat & Coordination

- Use the built-in chat to coordinate
- Share gift ideas and logistics
- Get updates on event status

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write tests for new features
- Update documentation as needed
- Ensure mobile responsiveness
- Test dark/light mode compatibility

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎄 Acknowledgments

- Icons by [Lucide](https://lucide.dev)
- Animations by [Framer Motion](https://framer.com/motion)
- Backend by [Convex](https://convex.dev)
- UI inspiration from modern design systems

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [FAQ](#-faq) section
2. Search existing [issues](https://github.com/your-repo/issues)
3. Create a new issue with detailed information

## 🎅 FAQ

**Q: Is this a real authentication system?**
A: This is a demo application. In production, you'd integrate with a proper auth provider like Auth0, Firebase Auth, or implement magic links.

**Q: Can I self-host this?**
A: Yes! You can deploy both the frontend and Convex backend yourself. See the deployment section for details.

**Q: Is there a mobile app?**
A: Currently, this is a web application optimized for mobile devices. A native app version could be built using React Native.

**Q: How many participants can join an event?**
A: There's no hard limit, but we recommend keeping events under 100 participants for optimal performance.

---

**Built with ❤️ for the holidays** 🎄✨
