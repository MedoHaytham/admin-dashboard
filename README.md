# Admin Dashboard

A modern, responsive, and feature-rich Admin Dashboard built with Next.js 16 (App Router), React 19, and Tailwind CSS. It leverages Redux Toolkit (RTK Query) for robust state management and data fetching, Framer Motion for smooth animations, and Recharts for interactive data visualization.

## ✨ Features

- **Next.js App Router**: Optimized routing and layouts.
- **State Management**: Built-in state management and automated API caching using Redux Toolkit and RTK Query.
- **Interactive Charts**: Data visualization using Recharts for sales, overview, and analytics.
- **Smooth Animations**: Component transitions and interactive elements powered by Framer Motion.
- **Modern UI**: Styled with Tailwind CSS 4, featuring a clean, responsive layout.
- **Authentication**: Cookie-based authentication management.
- **Validation**: Form and data validation using Joi.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Library**: [React](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) & RTK Query
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/) & [React Icons](https://react-icons.github.io/react-icons/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Validation**: [Joi](https://joi.dev/)

## 🚀 Getting Started

### Prerequisites

Make sure you have Node.js installed to run this project.

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd admin-dashboard
   ```

2. Install the dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

The project follows a feature-based structure within the `app` directory for the Next.js App Router:

- `/app/api`: Redux RTK Query configurations and API slices.
- `/app/components`: Reusable UI components (Tables, Charts, Skeletons, etc.).
- `/app/features`: Redux slices for global state features.
- `/app/overview`: Main dashboard overview page.
- `/app/products`: Products management table and details.
- `/app/orders`: Orders management and tracking.
- `/app/clients`: Clients directory and information.
- `/app/sales`: Detailed sales data and charts.
- `/app/settings`: User and dashboard settings (theme, profile, etc.).

## 🔌 Backend API Integration

The project uses Redux Toolkit's **RTK Query** for efficient API data fetching, caching, and state synchronization.

- **Base URL**: Communicates with a live backend API hosted at `https://e-commerce-backend-geri.onrender.com/api`.
- **Authentication**: Secure token-based authentication using `Authorization: Bearer <token>` headers. The `accessToken` is managed and persisted via `js-cookie`.
- **Automatic Token Refresh**: Implements a custom `baseQueryWithAuth` wrapper that automatically handles token expiration. If an API call fails with a `401 Unauthorized` status, the application seamlessly calls the `/auth/refresh` endpoint to retrieve a new token and retries the original request without disrupting the user journey.
- **Cache Invalidation**: RTK Query's automated cache invalidation is optimized with tags including `'Me'`, `'Users'`, `'Products'`, `'Categories'`, and `'Orders'`, ensuring that the dashboard's tables and charts remain synchronized after data mutations (e.g., editing products or completing orders).

## 📜 Scripts

- `npm run dev`: Runs the application in development mode.
- `npm run build`: Builds the app for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs ESLint to check for code issues.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](#) if you want to contribute.

Created with ❤️ by Mohamed Haytham.
