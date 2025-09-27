# Animall Frontend

A modern, responsive web application built with Next.js 14, TypeScript, and Tailwind CSS for the Animall pet services platform.

## Features

- **Modern UI/UX**: Beautiful, responsive design with smooth animations
- **Authentication**: Complete user authentication system with JWT
- **Real-time Chat**: Socket.io integration for instant messaging
- **Payment Processing**: Stripe integration for secure payments
- **Maps Integration**: Mapbox integration for location-based services
- **File Upload**: Image upload and management with AWS S3
- **Search & Filtering**: Advanced search with filters and pagination
- **Dark Mode**: Theme switching with system preference detection
- **Mobile Responsive**: Optimized for all device sizes
- **SEO Optimized**: Meta tags, structured data, and performance optimization

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: React Query
- **Forms**: React Hook Form + Yup validation
- **Icons**: Heroicons
- **UI Components**: Headless UI
- **Animations**: Framer Motion
- **Notifications**: React Hot Toast
- **Real-time**: Socket.io Client
- **Maps**: React Map GL + Mapbox GL
- **Payments**: Stripe.js + React Stripe.js
- **File Upload**: React Dropzone
- **Date Handling**: Date-fns + React Datepicker
- **Image Gallery**: React Image Gallery
- **Infinite Scroll**: React Infinite Scroll Component
- **Virtualization**: React Virtualized
- **Social Sharing**: React Share
- **SEO**: Next SEO + React Helmet Async

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm 9+
- Backend API running (see backend README)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd animall-platform/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` with your actual values:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
   NEXT_PUBLIC_MAPBOX_TOKEN=pk.your_token_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   ├── globals.css        # Global styles
│   └── ...                # Other pages
├── components/            # Reusable components
│   ├── layout/           # Layout components (Header, Footer)
│   ├── providers/        # Context providers
│   ├── ui/               # UI components
│   ├── forms/            # Form components
│   └── ...               # Feature-specific components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and configurations
├── types/                # TypeScript type definitions
└── utils/                # Helper functions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run type-check` - Run TypeScript type checking

## Key Components

### Providers
- **AuthProvider**: Manages user authentication state
- **ThemeProvider**: Handles dark/light theme switching
- **SocketProvider**: Manages real-time connections

### Layout Components
- **Header**: Navigation, user menu, theme toggle
- **Footer**: Links, social media, newsletter signup

### UI Components
- **Button**: Reusable button with variants
- **Input**: Form input components
- **Modal**: Modal dialog components
- **Card**: Card layout components
- **Badge**: Status and category badges

## Styling

The project uses Tailwind CSS with custom configuration:

- **Custom Colors**: Primary and secondary color palettes
- **Custom Shadows**: Soft, medium, and large shadow variants
- **Custom Animations**: Fade, slide, and scale animations
- **Responsive Design**: Mobile-first approach
- **Dark Mode**: Complete dark theme support

## State Management

- **Zustand**: Lightweight state management for global state
- **React Query**: Server state management and caching
- **React Hook Form**: Form state management
- **Context API**: Theme and authentication state

## API Integration

The frontend communicates with the backend API through:

- **RESTful Endpoints**: Standard HTTP methods
- **JWT Authentication**: Bearer token authentication
- **Error Handling**: Centralized error handling
- **Request/Response Interceptors**: Axios configuration

## Performance Optimization

- **Code Splitting**: Automatic code splitting with Next.js
- **Image Optimization**: Next.js Image component
- **Lazy Loading**: Component and route lazy loading
- **Caching**: React Query caching strategies
- **Bundle Analysis**: Webpack bundle analyzer

## Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm test:watch

# Run tests with coverage
npm test:coverage
```

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms

1. Build the application: `npm run build`
2. Start the production server: `npm start`
3. Deploy to your preferred platform

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | Yes |
| `NEXT_PUBLIC_SOCKET_URL` | Socket.io server URL | Yes |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | Yes |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Mapbox access token | Yes |
| `NEXT_PUBLIC_ENABLE_CHAT` | Enable chat feature | No |
| `NEXT_PUBLIC_ENABLE_PAYMENTS` | Enable payment feature | No |
| `NEXT_PUBLIC_ENABLE_MAPS` | Enable maps feature | No |
| `NEXT_PUBLIC_ENABLE_NOTIFICATIONS` | Enable notifications | No |

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Run tests: `npm test`
5. Commit your changes: `git commit -m 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@animall.com or create an issue in the repository.
