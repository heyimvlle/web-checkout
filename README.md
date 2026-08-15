# Web Checkout Kiosk

A self-service checkout application (kiosk/totem) designed for a snack bar.

## Extra features

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

## Decisions

### My General Thoughts About the Challenge
Since this is a self-service web checkout app, my goal was to build a straightforward server-side architecture paired with a UI inspired by McDonald's self-service kiosks—which I consider a prime example of this use case. The backend easily handles product categories, the product catalog, and the simulated payment process. 

I opted for a relational database because it provides a clean and efficient way to extract data insights. This allowed me to build extra features to help the user make good decisions: a "Best-Sellers" category showing the most popular items based on historical data, and a "Smart Trigger Upsell" that recommends the side item most frequently bought together with the burger they are adding to the cart.

I chose this Smart Trigger Upsell feature to be used only with the burgers, so the modal with the suggestion will only appear when the user is selecting what I consider to be the "main course" of the app, instead of popping out when the user is selecting, for ex, a Soda.

### How I Decided on the Stack
* **Frontend:** I chose React with TypeScript and Tailwind CSS because it's the stack I am most proficient in, allowing me to move fast and focus on the UX. To manage the cart state, I chose Zustand. It's a lightweight solution for global state management, avoiding the unnecessary complexity and boilerplate of other libraries for a app like this.
* **Backend:** I chose Node.js with Express and Prisma. Being very familiar with this ecosystem, I could quickly design a relational database schema. Prisma's querying and aggregation capabilities made it  easy to extract the order data required for the extra features

### How I used AI
I utilized Cursor as my development tool, using Gemini Pro 3.1 as my LLM. 

I guided the AI by describing the architecture, the features, and the exact business rules I wanted. For example, I didn't manually type out the Prisma schema syntax; instead, I described the exact relational structure (Products, Orders, Order Items) and the aggregation logic I needed for the upsell engine. Cursor generated the code, and my job was to review it, refine the logic, and ensure the UI/UX matched the physical kiosk context. 

I tried to review and update the code to make it as clean as possible, ensuring the code is maintainable, without a lot of complexities or weird strategies, and making sure the methods aren't too big by separating the code into small functions when necessary.

On the UI side, I made sure to review and test across different screen sizes, adjusting the Tailwind classes to handle responsiveness, either by changing them myself or using Cursor for that.


