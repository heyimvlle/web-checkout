# Web Checkout Kiosk

A self-service checkout application (kiosk/totem) designed for a snack bar.

## Features

- **Smart Trigger Upsell:** Recommends the most frequently bought side item when adding a main item, skipping the prompt if the item is already in the cart.
- **Bestsellers Category:** Automatically displays the top 4 most sold items based on historical order data.

## Tech Stack

- **Frontend:** React, Vite, TypeScript, Zustand, Tailwind CSS
- **Backend:** Node.js, Express, Prisma ORM, MySQL

## How to Run

### Prerequisites

- Docker & Docker Compose
- Node.js (for npm scripts)

### Setup

1. Open a terminal in the project root folder.
2. Start all services:

```bash
npm run docker-up
```

1. Access the application:

-  [http://localhost:5173](http://localhost:5173)

*(Note: Database migrations and seeding run automatically on startup).*

### Available Commands

- `npm run docker-up` - Start containers in the background
- `npm run docker-down` - Stop all containers
- `npm run docker-down:wipe` - Stop containers and wipe database data
- `npm run docker-logs` - View all logs in real-time
- `npm run docker-ps` - List running containers

