# Medstore Admin

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Table of Contents

- [Getting Started](#getting-started)
- [Features](#features)
- [Folder Structure](#folder-structure)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Learn More](#learn-more)
- [Deploy on Vercel](#deploy-on-vercel)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Features

- **Authentication**: Includes sign-in and sign-up pages.
- **Dashboard**: Manage stores, categories, inventories, and more.
- **API Integration**: Pre-built API routes for various functionalities.
- **GraphQL Support**: Includes a GraphQL schema for advanced queries.
- **UI Components**: A rich set of reusable UI components.

## Folder Structure

```plaintext
/Users/bg_ralph/Documents/Webprojects/medstore-admin
├── app/                # Application pages and layouts
├── components/         # Reusable UI components
├── graphql/            # GraphQL schema and related files
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries and helpers
├── prisma/             # Prisma schema for database
├── provider/           # Context providers
├── public/             # Static assets
```

## Environment Variables

To run this project, you need to set up the following environment variables:

```plaintext
DATABASE_URL=your_database_url
NEXT_PUBLIC_API_KEY=your_api_key
```

Create a `.env.local` file in the root directory and add these variables.

## Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm start`: Starts the production server.
- `npm run lint`: Runs the linter to check for code quality issues.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
