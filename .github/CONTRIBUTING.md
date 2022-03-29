# Contributing

## Cloning for Contribution
To set up the development environment to make changes to the code, clone the repo, install dependencies, and run it directly with `node` as Docker doesn't expose as much.

## Making Changes
To edit the code please keep a few things in mind:
1. Be able to explain changes you make; they should be legible and understandable.
2. Please try to abide by ESLint's rules, setting up ESLint is quite easy to do and not too difficult to follow.

## Testing Your Code
For testing, make sure to set up the prerequisites:
1. MongoDB: have a MongoDB server set up.
2. Environment Variables: take a look at the `docker-compose.yml` for examples.

Once that's done, you can run `yarn tsc` or `npx tsc` to build to JavaScript in the `built` directory. Here you'll find `deploy-commands.js` which you need to deploy the slash commands, and `index.js` which you can run to start the bot.

## Submitting Your Contribution
Creating a PR is easy enough and there are plenty of tutorials to do so. When contributing, please make sure to highlight and explain your change, with any import information additionally included.

---

# Thank you for any contributions!

---
