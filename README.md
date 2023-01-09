# Getting Started

Follow the steps below:

## ⏳ Installation

First, install all required dependencies :
```
npm install
```

Create a `.env` file inside the `/` folder having the following structure:
```env
DATABASE_URL=

NEXTAUTH_SECRET
NEXTAUTH_URL = http://localhost:3000 # or the link to your website

# Next Auth Discord Provider
DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=

# Next Auth Google Provider
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=


# Next Auth Github Provider
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

If you want to remove or add auth providers, you have to modify the following files :
`/src/env/schema.mjs` and `/src/pages/api/auth/[...nextauth].ts`.

# The Design 
The Figma file I used is from [frontend Mentor](https://www.frontendmentor.io/challenges/kanban-task-management-web-app-wgQLt-HlbB)
