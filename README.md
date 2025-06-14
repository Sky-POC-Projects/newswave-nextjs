
# NewsWave 🌊 - Curated News Platform

NewsWave is a modern news aggregation platform built with Next.js, React, and TypeScript. It allows publishers to post articles and subscribers to discover and read content based on their subscriptions. The platform also features AI-powered article summarization.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Directory Structure](#directory-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [1. Environment Variables](#1-environment-variables)
  - [2. Installation](#2-installation)
  - [3. Running Locally](#3-running-locally)
- [API Integration](#api-integration)
- [AI Features (Genkit)](#ai-features-genkit)
- [Running with Docker](#running-with-docker)
- [Deployment](#deployment)

## Overview

NewsWave serves as a central hub for news content. Publishers can manage their articles, and subscribers can personalize their news feed by subscribing to different publishers. The application leverages a modern tech stack for a responsive and efficient user experience.

## Features

- **User Roles**: Distinct interfaces and functionalities for Publishers and Subscribers.
- **Publisher Dashboard**:
  - View published articles.
  - Post new articles with title, content, and optional image URL.
- **Subscriber Dashboard**:
  - Personalized news feed based on subscriptions.
  - Manage subscriptions to various publishers.
- **AI-Powered Summarization**: Publishers can generate a concise summary of their article content using AI before posting.
- **API Driven**: Core functionalities like user management, article posting, and feeds are handled through an external REST API.
- **Responsive Design**: UI adapted for various screen sizes using ShadCN UI and Tailwind CSS.

## Tech Stack

- **Frontend**:
  - [Next.js](https://nextjs.org/) 15+ (App Router)
  - [React](https://reactjs.org/) 18+
  - [TypeScript](https://www.typescriptlang.org/)
  - [ShadCN UI](https://ui.shadcn.com/) (Component Library)
  - [Tailwind CSS](https://tailwindcss.com/) (Styling)
- **AI Integration**:
  - [Genkit (by Google)](https://firebase.google.com/docs/genkit): For building AI-powered flows.
  - Google AI (e.g., Gemini models via `@genkit-ai/googleai`)
- **State Management**: React Hooks (useState, useEffect, useContext), custom hooks.
- **Routing**: Next.js App Router.
- **Linting/Formatting**: ESLint, Prettier (implicitly configured with Next.js).

## Architecture

NewsWave is a full-stack application built primarily with Next.js.

- **Client-Side (Browser)**:
  - UI rendered using React components (functional components with Hooks).
  - Styling managed by Tailwind CSS and components from ShadCN UI.
  - Client-side routing handled by Next.js App Router.
  - User authentication state managed locally (localStorage and React Context).
- **Server-Side (Next.js)**:
  - Server Components for optimized rendering.
  - Server Actions for form submissions and mutations (e.g., posting articles, generating summaries).
  - API interactions proxied or handled via Server Components/Actions.
- **External API Integration**:
  - The application communicates with a separate backend API (PubSubAPI) for core data operations:
    - Managing publishers and subscribers.
    - Publishing articles.
    - Fetching news feeds and subscriptions.
  - The API base URL is configurable via an environment variable.
- **AI Features (Genkit)**:
  - Genkit flows are defined in `src/ai/flows/`. These are server-side functions.
  - Currently, an article summarization flow (`summarize-article.ts`) uses a Google AI model.
  - Genkit's development UI can be run locally to inspect and test flows.

## Directory Structure

Here's a brief overview of the key directories:

```
.
├── src/
│   ├── ai/                     # Genkit AI flows and configuration
│   │   ├── flows/              # Specific AI flows (e.g., summarizeArticle)
│   │   ├── dev.ts              # Genkit development server entry point
│   │   └── genkit.ts           # Genkit global AI instance initialization
│   ├── app/                    # Next.js App Router (pages, layouts, API routes)
│   │   ├── (authenticated)/    # Routes requiring authentication
│   │   │   ├── publisher/
│   │   │   └── subscriber/
│   │   ├── login/              # Login page
│   │   ├── globals.css         # Global styles & ShadCN theme variables
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Root page (handles initial auth redirect)
│   │   └── actions.ts          # Server Actions
│   ├── components/             # Reusable React components
│   │   └── ui/                 # ShadCN UI components
│   ├── data/                   # Mock data (used where API doesn't provide)
│   ├── hooks/                  # Custom React hooks (e.g., useAuth, useSubscriptions)
│   ├── lib/                    # Utility functions, validators
│   ├── services/               # API service for external communication
│   └── types/                  # TypeScript type definitions
├── public/                     # Static assets
├── .env.example                # Example environment variables
├── Dockerfile                  # For containerizing the application
├── next.config.ts              # Next.js configuration
├── package.json                # Project dependencies and scripts
└── tsconfig.json               # TypeScript configuration
```

## Prerequisites

- [Node.js](https://nodejs.org/) (v18.x or later recommended)
- [npm](https://www.npmjs.com/) (v9.x or later) or [yarn](https://yarnpkg.com/)

## Getting Started

Follow these steps to set up and run the project locally.

### 1. Environment Variables

The application requires certain environment variables to function correctly. Create a `.env` file in the root of the project by copying the example file:

```bash
cp .env.example .env
```

Then, edit the `.env` file with the appropriate values:

- `NEXT_PUBLIC_API_BASE_URL`: The base URL of the external PubSubAPI. (e.g., `https://your-api.ngrok-free.app`)
- `GOOGLE_API_KEY`: Your API key for Google AI Studio (e.g., for Gemini models used by Genkit). This is required for the article summarization feature. You can obtain one from [Google AI Studio](https://aistudio.google.com/app/apikey).

**Example `.env` file:**
```env
NEXT_PUBLIC_API_BASE_URL=https://your-pubsub-api-base-url.com
GOOGLE_API_KEY=your_google_ai_api_key_here
```

### 2. Installation

Clone the repository (if you haven't already) and install the project dependencies:

```bash
npm install
# or
# yarn install
```

### 3. Running Locally

The application consists of the Next.js frontend and the Genkit development UI for AI flows. You'll typically run these in separate terminal sessions.

**a) Start the Next.js Development Server:**

```bash
npm run dev
```
This will start the Next.js application, usually on `http://localhost:9002` (as per `package.json`).

**b) Start the Genkit Development Server (for AI features):**

To use AI features like article summarization, and to inspect/test Genkit flows, run:

```bash
npm run genkit:dev
```
This will start the Genkit development UI, usually on `http://localhost:4000`. You can open this URL in your browser to see registered flows, run them, and view traces.

Make sure both servers are running if you intend to use features that rely on them (e.g., article summarization needs the Genkit server and the Next.js app to call it).

## API Integration

NewsWave integrates with an external PubSub-style REST API. The service responsible for these interactions is located in `src/services/apiService.ts`. The base URL for this API must be configured in the `.env` file via `NEXT_PUBLIC_API_BASE_URL`.

Current API interactions include:
- User (Publisher/Subscriber) creation.
- Fetching all available publishers.
- Publishing articles.
- Subscribing/Unsubscribing to publishers.
- Fetching a subscriber's personalized news feed.
- Fetching a publisher's posted articles.

## AI Features (Genkit)

AI-powered functionalities are built using Genkit.
- **Summarize Article**: Located in `src/ai/flows/summarize-article.ts`, this flow takes article content as input and returns a generated summary. It uses a Google AI model.
- **Configuration**: Genkit is initialized in `src/ai/genkit.ts`, currently configured to use Google AI.
- **Development**: Use the Genkit Dev UI (`npm run genkit:dev`) to monitor, test, and trace AI flow executions.

## Running with Docker

To run NewsWave using Docker:

1.  **Build the Docker image:**
    Ensure you have Docker installed and running. In the project root, run:
    ```bash
    docker build -t newswave-app .
    ```

2.  **Run the Docker container:**
    You'll need to pass the environment variables to the container.
    ```bash
    docker run -p 9002:9002 \
      -e NEXT_PUBLIC_API_BASE_URL="your_api_base_url_here" \
      -e GOOGLE_API_KEY="your_google_ai_api_key_here" \
      newswave-app
    ```
    Replace `"your_api_base_url_here"` and `"your_google_ai_api_key_here"` with your actual API base URL and Google AI key.

    The application will be accessible at `http://localhost:9002`.

    *Note: For Genkit AI features to work correctly when Dockerized, the Next.js application (running inside Docker) needs to be able to reach the Genkit instance. If Genkit is also Dockerized or running on a different host, ensure network connectivity.*

## Deployment

This Next.js application is configured for standalone output (`output: 'standalone'` in `next.config.ts`), which is suitable for deployment on various platforms, including Firebase App Hosting (as indicated by `apphosting.yaml`).

When deploying:
- Ensure all required environment variables (`NEXT_PUBLIC_API_BASE_URL`, `GOOGLE_API_KEY`) are set in your deployment environment.
- The Genkit flows are server-side and will be part of the deployed Next.js application.

---

Happy Coding!
