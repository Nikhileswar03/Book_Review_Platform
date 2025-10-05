# BookWise API Backend

This directory contains the Node.js, Express, and MongoDB backend for the BookWise application.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/try/download/community) (or a MongoDB Atlas cloud instance)

### Installation

1.  Navigate into the `backend` directory:
    ```bash
    cd backend
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in this directory by copying the example file:
    ```bash
    cp .env.example .env
    ```
4.  Open the new `.env` file and add your MongoDB connection string and a JWT secret.
    ```
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=a_strong_secret_key_for_json_web_tokens
    ```

### Running the Server

-   **Development Mode** (with hot-reloading via `nodemon`):
    ```bash
    npm run dev
    ```
-   **Production Mode**:
    ```bash
    npm start
    ```

The API server will then be running on `http://localhost:5000`.