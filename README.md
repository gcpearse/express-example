# Express example

A simple Express server application built with TypeScript and PostgreSQL.

## Contents

- [Initial setup](#initial-setup)
- [Express setup](#express-setup)
- [Running the server](#running-the-server)
- [Database setup](#database-setup)

## Initial setup

### Initialisation

Initialise a new Node project:
```zsh
npm init -y
```

### TypeScript

Install TypeScript:
```zsh
npm i -D typescript
```

Create a `tsconfig.json` file:
```zsh
npx tsc --init
```

Enable the following settings in `tsconfig.json`:
- `"rootDir": "./src"`
- `"outDir": "./dist"` 
- `"noImplicitReturns": true` to flag code paths that do not return a value
- `"noUnusedLocals": true` to flag variables that are declared but never read
- `"noUnusedParameters": true` to flag parameters that are declared but never read

Install type definitions for Node:
```zsh
npm i -D @types/node
```

## Express setup

Install Express and corresponding type definitions:
```zsh
npm install express
```
```zsh
npm i -D @types/express
```

Create a `src` directory with two files - `app.ts` and `listen.ts`:
```zsh
mkdir src && touch src/app.ts src/listen.ts
```

Add the following code to `app.ts`:
```js
import express from "express"

export const app = express()

app.get("/", (_req, res) => {
  res.send("Hello, world!")
})
```

Add the following code to `listen.ts`:
```js
import { app } from "./app.js"

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
```

If you see an import warning, add the following to `package.json`:
```json
"type": "module"
```

In `package.json`, make `listen.js` the primary entry point:
```json
"main": "listen.js"
```

## Running the server

Add the following script to `package.json`:
```json
"start": "tsc && node dist/listen.js"
```

Now run the command to compile the code and start the server:
```zsh
npm run start
```

## Database setup

### Installing PostgreSQL with Homebrew

Install the latest version of PostgreSQL with `brew install` e.g.
```zsh
brew install postgresql@17
```

To confirm installation, run:
```zsh
psql --version
```

To start the server, run:
```zsh
brew services start postgresql@17
```

To connect to your local databases, run:
```zsh
psql
```

If you see a database not found warning when running `psql`, you may need to create a database for your username with the following command:
```zsh
createdb <username>
```

Helpful commands once connected:
- `\q` - quit
- `\l` - list your databases
- `\c <db name>` - connect to a database
- `\dt` - list relations / tables

### Creating the database

Create a `src/db` directory with a `db-setup-sql` file:
```zsh
mkdir src/db && touch src/db/db-setup.sql
```

Add the following code to `db-setup-sql` to drop and create test and development databases:
```sql
DROP DATABASE IF EXISTS express_example_dev;
DROP DATABASE IF EXISTS express_example_test;

CREATE DATABASE express_example_dev;
CREATE DATABASE express_example_test;
```

Add the following script to `package.json`:
```json
"db-setup": "psql -f src/db/db-setup.sql"
```

### Using PostgreSQL with Node

Install node-postgres and corresponding type definitions:
```zsh
npm install pg
```
```zsh
npm i -D @types/pg
```

### Environment variables and dotenv

Create `.env` files for testing and development e.g.
```zsh
touch .env.test .env.development
```

Add `PGDATABASE=` plus a database name to each `.env` file matching the database names in `db-setup.sql` e.g.
```
PGDATABASE=express_example_test
```

Install the dotenv package:
```zsh
npm install dotenv
```

### Connection pool

Create an `index.ts` file in `src/db`:
```zsh
touch src/db/index.ts
```

Add the following code to `index.ts`:
```js
import dotenv from "dotenv"
import { Pool } from "pg"

const ENV = process.env.NODE_ENV || "development"

dotenv.config({
  path: `${__dirname}/../../.env.${ENV}`
})

if (!process.env.PGDATABASE) {
  throw new Error("PGDATABASE is not set")
}

export const db = new Pool()
```

This sets up dotenv configuration and a database connection pool.
