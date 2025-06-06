
# 📍 NearBy - On-Demand Local Delivery App


[![React Native](https://img.shields.io/badge/React%20Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![Hono](https://img.shields.io/badge/Hono-E36002?style=for-the-badge&logo=hono&logoColor=white)](https://hono.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![tRPC](https://img.shields.io/badge/tRPC-2596BE?style=for-the-badge&logo=trpc&logoColor=white)](https://trpc.io/)

An innovative, full-stack, on-demand local delivery application that connects users with nearby stores. This project features separate apps for users, delivery partners, and store vendors, all updated in real-time.

## ✨ Features

*   **Three-App Ecosystem:** Separate, tailored applications for Customers, Delivery Partners, and Store Vendors.
*   **Geospatial Functionality:** Users can only view and order from stores within their immediate vicinity, powered by PostGIS.
*   **Real-Time Tracking & Updates:** Live order status, notifications, and delivery partner tracking are enabled via WebSockets.
*   **End-to-End Type Safety:** tRPC ensures type safety between the Hono backend and the React Native frontend.
*   **Secure Authentication:** A dedicated OAuth server built with Open Auth JS handles user authentication.
*   **Modern Mobile Stack:** Built with React Native (Expo) and styled with NativeWind for a seamless cross-platform experience.

## 🚀 Tech Stack

*   **Frontend:** React Native with Expo
*   **Backend:** Hono
*   **Database:** PostgreSQL with PostGIS for geospatial queries
*   **API:** tRPC
*   **ORM:** Drizzle ORM
*   **State Management:** Zustand
*   **Data Fetching:** Tanstack Query
*   **Forms:** Tanstack Form
*   **Styling:** NativeWind
*   **Authentication:** Open Auth JS (OAuth Server)
*   **Navigation:** Expo Router
*   **Maps:** Google Maps SDK

## 🏛️ System Architecture

The application suite consists of three separate mobile apps and a central backend server. WebSockets facilitate instant, bidirectional communication, ensuring all parts of the system are synchronized. For example, a new order from the User App instantly notifies the Store App, and a "ready for pickup" status from the store instantly alerts nearby Delivery Partner Apps.

```
[User App] <--> [WebSocket] <--> [Backend Server] <--> [PostgreSQL DB]
   ^                                    ^
   |                                    |
[Delivery Partner App] <--> [WebSocket] |
   ^                                    |
   |                                    |
[Store Vendor App] <--> [WebSocket] ----
```

## ⚙️ Getting Started

### Prerequisites

*   Node.js & Bun
*   Docker

### Setup & Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2.  **Start the database with Docker:**
    ```bash
    # Run the PostGIS container
    docker run --name some-postgis -e POSTGRES_PASSWORD=mysecretpassword -d postgis/postgis

    # To start the container if it's stopped
    docker start some-postgis
    ```

3.  **Run the backend server:**
    *   Create a `.env` file in the backend directory with your `DATABASE_URL`.
    *   From the project root, run:
    ```bash
    # Install dependencies and run the server
    bun install
    bun run backend # Assuming a script named "backend" in your root package.json
    ```

4.  **Run the frontend apps:**
    *   Navigate to an app directory (e.g., `user-app`).
    *   Install dependencies and start the development server.
    ```bash
    cd user-app
    bun install
    npx expo start
    ```
    *   Repeat for `delivery-partner-app` and `store-vendor-app`.

