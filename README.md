# ₹ Webcods Gross - Finance Tracker

A modern personal finance tracking application built with React, Firebase, and Tailwind CSS.

## Features

- 💰 Track income and expenses
- 📊 Visual charts for financial overview (Daily, Weekly, Monthly views)
- 🔄 Real-time data sync with Firebase Realtime Database
- 📱 Progressive Web App (PWA) support
- 🌙 Modern, responsive UI with Tailwind CSS
- 🔐 Anonymous authentication for privacy
- 💾 Automatic data backup to cloud
- 📴 Offline support with automatic sync

## Technologies

This project is built with:

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn-ui
- **Styling**: Tailwind CSS
- **Database**: Firebase Realtime Database
- **Authentication**: Firebase Anonymous Auth
- **Charts**: Recharts
- **Date Handling**: date-fns
- **Form Management**: React Hook Form with Zod validation

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or bun

### Installation

1. Clone the repository:
```sh
git clone <YOUR_GIT_URL>
cd webcodsgross-main
```

2. Install dependencies:
```sh
npm install
```

3. Start the development server:
```sh
npm run dev
```

The application will be available at `http://localhost:8080/`

## Firebase Setup

This app uses Firebase for data storage. To set up Firebase:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Authentication** → **Sign-in method**
4. Enable **Anonymous** authentication
5. (Optional) Configure Realtime Database security rules:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    }
  }
}
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/        # React components
├── hooks/            # Custom React hooks
├── lib/              # Firebase configuration
├── pages/            # Page components
├── services/         # Firebase services
├── types/            # TypeScript type definitions
└── main.tsx          # Application entry point
```

## License

This project is private and not licensed for redistribution.

## Author

Webcods
