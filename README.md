# BookWise: A Modern Book Review Platform

BookWise is a feature-rich, single-page application where users can discover, add, and review their favorite books. It's built with a modern frontend stack, demonstrating best practices in React, TypeScript, and component-based design. The application is fully responsive, supports dark/light themes, and provides a seamless user experience from authentication to content interaction.

## Project Links

- **GitHub Repository**: `[Your GitHub repository link here]`
- **Live Deployment**: `[Your live deployment link here]`

## Key Features

- **User Authentication**: Secure sign-up, login, and logout functionality. User sessions are persisted using local storage.
- **Browse & Discover**: A dynamic homepage to browse all books with filtering (by genre), sorting (by rating, year), and a debounced search (by title, author).
- **Pagination**: Efficiently handles large collections of books.
- **Book Management (CRUD)**: Authenticated users can add new books, edit their own submissions, and delete them.
- **Review System (CRUD)**: Logged-in users can write, rate, and delete their own reviews on any book.
- **Detailed Book View**: A dedicated page for each book, showing its cover, description, avery
- **Data Visualization**: An interactive bar chart on the book details page that visualizes the distribution of ratings.
- **User Profiles**: A personal dashboard where users can see a list of books they've added and the reviews they've written.
- **Responsive Design**: A mobile-first, fully responsive layout that works beautifully on all screen sizes.
- **Dark Mode**: A sleek dark theme that can be toggled and is saved as a user preference.
- **Loading Skeletons**: Smooth loading states that prevent layout shifts and improve perceived performance.
- **Full Stack Ready**: Includes a complete Node.js/Express backend structure, ready to be connected.
- **Mock Backend**: A simulated API (`frontend/services/mockApi.ts`) mimics a real backend, allowing the frontend to be developed and showcased independently.

## Tech Stack

- **Frontend**: [React](https://reactjs.org/) (v19) with Hooks, [TypeScript](https://www.typescriptlang.org/)
- **Backend**: [Node.js](https://nodejs.org/), [Express](https://expressjs.com/), [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) for utility-first styling and easy theme customization.
- **Routing**: [React Router](https://reactrouter.com/) (v6) for client-side routing.
- **State Management**: React Context API for managing global state (authentication, theme).
- **Data Visualization**: [Recharts](https://recharts.org/) for creating the interactive rating distribution chart.

## Project Structure

The project is organized into `frontend` and `backend` directories, representing a classic MERN stack architecture.

```
repository-root/
├── frontend/       # All React frontend code
│   ├── components/
│   ├── pages/
│   └── ...
└── backend/        # All Node.js/Express backend code
    ├── config/
    ├── models/
    ├── routes/
    └── server.js
```

## Full Stack Setup

To run the complete application, you need to run both the frontend and backend servers.

### 1. Backend Setup

- Navigate to the `backend` directory.
- Follow the instructions in `backend/README.md` to install dependencies, set up your environment variables (like your database connection string), and start the server.
- The backend will typically run on `http://localhost:5000`.

### 2. Frontend Setup

- The frontend is designed to run in a simple static server environment.
- When connecting to the live backend, you will need to update the API calls in `frontend/services/` to fetch from your backend endpoint (e.g., `http://localhost:5000/api/books`) instead of the `mockApi.ts`.

---

## Standalone Frontend (with Mock API)

This application can also be run in a standalone mode without the backend, using the built-in mock API.

1.  **No Installation Needed**: All dependencies like React, React Router, and Tailwind CSS are loaded via CDN scripts defined in `frontend/index.html`.
2.  **Entry Point**: The application loads from `frontend/index.html`. The main React code is in `frontend/index.tsx`, which mounts the `App` component.
3.  **Mock API**: All data fetching is handled by `frontend/services/mockApi.ts`, which simulates a database and network latency.
4.  **Default User**: A default user is pre-configured for easy testing.
    - **Email**: `alice@example.com`
    - **Password**: `password123`