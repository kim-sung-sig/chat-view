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

## Features

- **Server/Channel Switching**: Fully functional state management.
- **Messaging**: Send messages in real-time (local state).
- **Validation**: Input validation for empty messages.
- **Design**: Premium dark mode aesthetic matching Discord.
