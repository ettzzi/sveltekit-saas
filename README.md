# SvelteKit Starter

SvelteKit Starter is a project to start building fast your next project with SvelteKit and TypeScript.

By cloning this project you will have already a project with:
- E-mail and password authentication
- Simple profile management to change name, e-mail, password.
- Account deletion
- Request to reset password

## Tech Stack
- SvelteKit
- TypeScript
- Zod for form validations
- Prisma as ORM
- Postmark for Email delivery
- MySQL with PlanetScale
- CSS for styling

## Setup

1. Clone the project
2. `cd sveltekit-saas`
3. `npm install`
4. `cp .env.example .env`
5. Setup the database. For an easy setup on MacOS checkout [DBngin](https://dbngin.com).
6. Setup the database `npx prisma db push`
7. `npm run dev`

### Google Auth
Please refer to [Google Oauth Documentaiton](https://developers.google.com/identity/protocols/oauth2/web-server#httprests)

## Deployment

Currently, the project is setup for deployment on [Vercel](https://vercel.com) and uses MySQL as database from [PlanetScale](http://planetscale.com). This is mostly chosen because of their generous free tiers.

## Roadmap

- [ ] Stripe integration
- [ ] OAuth integration
- [ ] Magic links
- [ ] Improve Design