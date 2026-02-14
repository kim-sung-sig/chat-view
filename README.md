# Discode (Discord Clone)

A modern, object-oriented, friendly Discord clone built with Nuxt 3 and TypeScript.

## Architecture

- **Frontend**: Nuxt 3 (Vue 3)
- **State Management**: Pinia (Store pattern for clear separation of concerns)
- **Styling**: Vanilla CSS (CSS Modules/Scoped) with CSS Variables for theming.
- **Backend (Future)**: Java (Spring Boot expected)

## Project Structure

- `components/`: Atomic design components.
  - `server/`: Server list and navigation.
  - `channel/`: Channel list and sidebar.
  - `chat/`: Main chat area and message items.
- `store/`: Business logic and state (Mock data for now).
- `types/`: TypeScript interfaces for Domain Models (User, Message, Server).
- `layouts/`: Main application layout.

## Running

```bash
npm install
npm run dev
```

## PWA Installation

This app is a Progressive Web App (PWA) and can be installed on your device:

### Desktop (Chrome/Edge)
1. Visit the app in your browser
2. Look for the install icon (➕) in the address bar
3. Click "Install" or use the in-app install prompt

### Mobile (iOS)
1. Open the app in Safari
2. Tap the Share button
3. Scroll down and tap "Add to Home Screen"

### Mobile (Android)
1. Open the app in Chrome
2. Tap the three-dot menu
3. Tap "Install app" or "Add to Home screen"

### Generate PWA Icons
If you need to regenerate the PWA icons:
```bash
npm run generate-icons
```

## Features

- **Server/Channel Switching**: Fully functional state management.
- **Messaging**: Send messages in real-time (local state).
- **Validation**: Input validation for empty messages.
- **Design**: Premium dark mode aesthetic matching Discord.
- **PWA Support**: Install as a native app on mobile and desktop devices.
  - Offline capability
  - Push notifications ready
  - App-like experience
  - Auto-updates
