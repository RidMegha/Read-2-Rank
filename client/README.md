# Read-2-Rank - Competitive Exam Preparation Platform

A complete web application that fetches daily news, extracts GK points, and provides a revision hub for aspirants.

## Prerequisites
- Node.js (v14 or higher) installed on your machine.
- NPM (Node Package Manager) included with Node.js.

## Installation & Setup

### 1. Backend Setup
The backend handles the API, Database, and News Fetching.

1.  Open your terminal/command prompt.
2.  Navigate to the `server` folder:
    ```bash
    cd server
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  (Optional) Create a `.env` file in the `server` directory for secrets:
    ```
    PORT=5000
    JWT_SECRET=your_secure_secret
    ```

### 2. Frontend Setup
The frontend is a React application.

1.  Open a new terminal window (or go back to root).
2.  Navigate to the `client` folder:
    ```bash
    cd client
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```

## Running the Application

### Option A: Development Mode (Best for editing)
Run backend and frontend in separate terminals.

**Terminal 1 (Server):**
```bash
cd server
node server.js
```
*Server runs on http://localhost:5000*

**Terminal 2 (Client):**
```bash
cd client
npm run dev
```
*Client runs on http://localhost:5173 (usually)*

### Option B: Production Mode (Best for usage)
Build the frontend and serve it via the backend.

1.  **Build the Frontend:**
    ```bash
    cd client
    npm run build
    ```
    *This creates a `dist` folder with the optimized app.*

2.  **Run the Server:**
    ```bash
    cd ../server
    node server.js
    ```

3.  **Access the App:**
    Open your browser and go to: **http://localhost:5000**

## Features
- **Daily News:** Automatically fetched from GNews.
- **Smart GK Extraction:** Exam-relevant points extracted from news with Priority levels.
- **Revision Hub:** Calendar-based archive of daily GK with Monthly/Yearly views.
- **News Archive:** Access the last 30 days of global and Indian news.
- **User Accounts:** Signup/Login, Profile Management, and Settings.
- **Export Tools:** Download GK compilations as PDF or use Print View.
- **Dark Mode:** Beautiful dark theme support with gradient UI.

## API Key
The project uses the GNews API Key provided. If you need to change it, look in `server/server.js`.

























# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
