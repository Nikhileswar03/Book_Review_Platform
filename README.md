# BookWise: A Modern Book Review Platform

BookWise is a feature-rich, single-page application where users can discover, add, and review their favorite books. It's built with a modern frontend stack, demonstrating best practices in React, TypeScript, and component-based design. The application is fully responsive, supports dark/light themes, and provides a seamless user experience from authentication to content interaction.

## Key Features

- **User Authentication**: Secure sign-up, login, and logout functionality. User sessions are persisted using local storage.
- **Browse & Discover**: A dynamic homepage to browse all books with filtering (by genre), sorting (by rating, year), and a debounced search (by title, author).
- **Pagination**: Efficiently handles large collections of books.
- **Book Management (CRUD)**: Authenticated users can add new books, edit their own submissions, and delete them.
- **Review System (CRUD)**: Logged-in users can write, rate, and delete their own reviews on any book.
- **Detailed Book View**: A dedicated page for each book, showing its cover, description, average rating, and all user reviews.
- **Data Visualization**: An interactive bar chart on the book details page that visualizes the distribution of ratings.
- **User Profiles**: A personal dashboard where users can see a list of books they've added and the reviews they've written.
- **Responsive Design**: A mobile-first, fully responsive layout that works beautifully on all screen sizes.
- **Dark Mode**: A sleek dark theme that can be toggled and is saved as a user preference.
- **Loading Skeletons**: Smooth loading states that prevent layout shifts and improve perceived performance.
- **Mock Backend**: A simulated API (`services/mockApi.ts`) mimics a real backend with asynchronous delays, allowing the frontend to be developed and showcased independently.

## Tech Stack

- **Frontend**: [React](https://reactjs.org/) (v19) with Hooks, [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) for utility-first styling and easy theme customization.
- **Routing**: [React Router](https://reactrouter.com/) (v6) for client-side routing.
- **State Management**: React Context API for managing global state (authentication, theme).
- **Data Visualization**: [Recharts](https://recharts.org/) for creating the interactive rating distribution chart.
- **Linting/Formatting**: (Implicit) Follows modern code standards for readability and maintenance.

## Project Structure

The codebase is organized into logical directories to ensure scalability and maintainability.

```
/
├── components/       # Reusable UI components (Header, StarRating, Loaders)
├── context/          # React Context providers (AuthContext, ThemeContext)
├── hooks/            # Custom React Hooks (useAuth, useTheme, useDebounce)
├── pages/            # Page-level components mapped to routes
├── services/         # API layer, including the mock API simulation
├── App.tsx           # Main application component with routing logic
├── index.html        # The entry point of the application
├── index.tsx         # The main script that renders the React app
├── types.ts          # Centralized TypeScript type definitions
└── README.md         # This file
```

## Getting Started

This application is designed to run in an environment where the `index.html` file is served, and the JavaScript modules are handled accordingly.

1.  **No Installation Needed**: All dependencies like React, React Router, and Tailwind CSS are loaded via CDN scripts defined in `index.html`.
2.  **Entry Point**: The application loads from `index.html`. The main React code is in `index.tsx`, which mounts the `App` component to the `<div id="root">`.
3.  **Mock API**: All data fetching and manipulation is handled by the mock API located at `services/mockApi.ts`. This file simulates a database and network latency, allowing the frontend to function as if it were connected to a real backend.
4.  **Default User**: A default user is pre-configured for easy testing.
    - **Email**: `alice@example.com`
    - **Password**: `password123`
