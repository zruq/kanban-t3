#  Kanban task management web app 

![The app is fully responsive!](/Kanban.jpg)

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [Built with](#built-with)
 - [Installation](#installation)
- [Author](#author)




## Overview

### The challenge

This is a full stack solution to the kanban challenge on [frontendmentor](https://www.frontendmentor.io/challenges/kanban-task-management-web-app-wgQLt-HlbB) (they provide the design, figma file and assets and the goal is to produce an app)

Users are able to:

- View the optimal layout for the app depending on their device's screen size
- See hover states for all interactive elements on the page
- Create, read, update, and delete boards, columns, tasks and subtasks
- Receive form validations when trying to create/edit boards and tasks
- Mark subtasks as complete and move tasks between columns
- Hide/show the board sidebar
- Toggle the theme between light/dark modes
- Drag and drop tasks to change their status and re-order them in a column

### Screenshot

![Overview.gif](/)

### Links

- Live Site URL: [Vercel](https://kanban-task-management-web-app-plum.vercel.app/)

## Built with
- [React](https://reactjs.org/) - JS library
- [Next.js](https://nextjs.org/) - React framework
- [Tailwindcss](https://tailwindcss.com) - CSS framework
- [tRPC](https://trpc.io) - Backend library
- [NextAuth.js](https://next-auth.js.org/) - Authentication library for Next.js
- [T3 stack](https://create.t3.gg/) - All past tools in one repo!
- [dnd-kit](https://dndkit.com/) A Drag and drop Library

## Installation

First, install all required dependencies:

```
npm install
```

Create a `.env` file inside the `/` folder having the following structure:

```.env
DATABASE_URL=

NEXTAUTH_SECRET=
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

If you want to remove or add auth providers, you have to modify the following files : `/src/env/schema.mjs` and `/src/pages/api/auth/[...nextauth].ts`.

## Author

- Website - [Mehdi Zibout](https://www.zryqv.com)
- Frontend Mentor - [@mehdi-zibout](https://www.frontendmentor.io/profile/mehdi-zibout)



