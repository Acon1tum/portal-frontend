# Project Overview

This is a Next.js 15 application named "B2B Connect". It serves as a business-to-business portal, allowing users to connect with other businesses, manage profiles, post job listings, events, news, and more. The application implements a role-based access control system with distinct dashboards for different user types (e.g., Super Admin, Exhibitor/Sponsor, Corporate Professional).

## Core Technologies

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI (built on Radix UI primitives)
- **State Management**: React Context API (`auth-context`) and potentially Redux Toolkit (based on dependencies)
- **Authentication**: Session-based authentication with cookie handling (`js-cookie`) and Google OAuth (`next-auth`).
- **Data Fetching**: Custom hooks (`useDashboardData`, `useUsersData`, `usePostings`) for interacting with a backend API.
- **API Communication**: Fetch API, configured with rewrites in `next.config.ts` to proxy requests to a backend (likely running on `localhost:3200` by default).
- **Animations**: Lottie React for complex animations.
- **Forms**: React Hook Form with Zod for validation.
- **Icons**: Lucide React

## Project Structure

- `src/app`: Contains the Next.js App Router pages and layouts.
  - `(dashboard)`: Groups routes related to the main dashboard area, separated by user roles (admin, owner, dashboard, posts, etc.).
  - `auth`: Contains authentication pages (login, register, reset password).
  - `main`: Likely the main landing or initial page after authentication.
  - `modals`: Reusable modal components.
  - `reset-password`: Specific routes for password reset flows.
- `src/components`: Reusable UI components.
  - `ui`: Shadcn UI components.
  - `custom-ui`: Project-specific custom components, including those for authentication (`auth`).
- `src/lib`: Utility libraries and providers (e.g., `auth-context`, `utils`).
- `src/hooks`: Custom React hooks for data fetching and logic.
- `src/service`: Services for interacting with backend APIs (e.g., `authservice`).
- `src/utils`: General utility functions and type definitions (`types.ts`).
- `public`: Static assets like images and the Lottie animation file.
- Configuration files for Next.js (`next.config.ts`), Tailwind CSS, ESLint, and TypeScript are present.

## Key Features

- **User Authentication**: Login (email/password and Google), registration, session management, and logout.
- **Role-Based Dashboards**: Different views and functionalities based on user roles (Super Admin, Exhibitor/Sponsor, Corporate Professional).
- **Business/User Discovery**: Search and browse businesses and user profiles.
- **News and Updates Feed**: Displays various types of posts (News, Events, Job Listings, Announcements, Promotions, General) with filtering.
- **Featured Businesses Section**.
- **Recent Activity Feed**.
- **Post Management**: Creation and management of different post types.

## Development Conventions

- **TypeScript**: Strong typing is used throughout the application.
- **Component Structure**: Components are typically structured with a main export and a default export (e.g., `LoginForm` component).
- **Custom Hooks**: Data fetching logic is abstracted into custom hooks.
- **Context API**: Authentication state is managed using React Context.
- **Service Layer**: API calls are encapsulated in service files.
- **UI Library**: Shadcn UI components are used for consistent design.
- **Routing**: Uses the Next.js App Router with group routes (parentheses) for organizing dashboard sections.

## Building and Running

These commands are defined in `package.json`:

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts the production server (after building).
- `npm run lint`: Runs the linter.

The application is configured to proxy API requests to a backend server via rewrites in `next.config.ts`.

## Qwen Added Memories
- DO NOT RUN THIS COMMAND `npm run dev, npm run build, npm run lint`
