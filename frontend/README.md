# Frontend - React Web App

React Web application cho Movie Booking System.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Setup environment
cp env.example .env

# Run development server
npm run dev

# Access at http://localhost:3000
```

## 📚 Documentation

Chi tiết tại [docs/](../docs/README.md):
- [Frontend Development Guide](../docs/Frontend_Development_Guide.md)
- [System Architecture](../docs/System_Architecture_Analysis.md)
- [API Documentation](../docs/API_Documentation.md)

## 🏗️ Architecture

### Feature-First Structure
```
src/
├── features/          # Feature modules
│   ├── auth/         # Authentication
│   ├── movies/       # Movies management
│   └── booking/      # Booking system
├── components/        # Shared components
├── hooks/            # Custom hooks
├── lib/              # Utilities & configs
├── navigation/       # Routing
├── services/         # API services
├── styles/           # CSS files
└── types/            # TypeScript types
```

## 🛠️ Technology Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **State Management**: TanStack Query
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form

## 🔧 Configuration

```bash
# Environment Variables
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_API_TIMEOUT=30000
JWT_ACCESS_TOKEN_KEY=access_token
JWT_REFRESH_TOKEN_KEY=refresh_token
```

## 📱 Features

### ✅ Implemented
- Authentication (Login/Register)
- Movie listing and details
- User profile management
- Responsive design
- TypeScript support
- API integration

### 🔄 Planned
- Movie booking system
- Seat selection
- Payment integration
- Admin dashboard

## 🧪 Development

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Linting
npm run lint
npm run lint:fix

# Type checking
npm run type-check
```

## 📦 Build & Deploy

```bash
# Development
npm run dev

# Production build
npm run build

# Preview
npm run preview
```

---

**Made with ❤️ by ChickenGang KTPM Team**