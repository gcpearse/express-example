# Express example

A simple Express server application built with TypeScript and PostgreSQL.

## Contents

- [Initial setup](#initial-setup)
  - [Initialisation](#initialisation)
  - [TypeScript](#typescript)
- [Express setup](#express-setup)
- [Running the server](#running-the-server)
- [Database setup](#database-setup)
  - [Installing PostgreSQL with Homebrew](#installing-postgresql-with-homebrew)
  - [Creating the database](#creating-the-database)
  - [Using PostgreSQL with Node](#using-postgresql-with-node)
  - [Environment variables and dotenv](#environment-variables-and-dotenv)
  - [Connection pool](#connection-pool)
  - [Test data](#test-data)
  - [Seeding](#seeding)
  - [Development data](#development-data)
- [Building an endpoint](#building-an-endpoint)
  - [Routes](#routes)
  - [Controllers](#controllers)
  - [Services](#services)
- [Error handling](#error-handling)
- [Tests](#tests)
  - [Install and configure Jest](#install-and-configure-jest)
  - [Integration tests](#integration-tests)

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
```json
"rootDir": "./src"
"outDir": "./dist"
"noImplicitReturns": true
"noUnusedLocals": true
"noUnusedParameters": true
```

These settings create a source directory `/src` and distribution directory `/dist`, as well as flagging:
- variables with an implicit `any` type
- variables and parameters that are declared but never read

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

Install CORS and corresponding type definitions:
```zsh
npm install cors
```
```zsh
npm i -D @types/cors
```

Create a `src` directory and add two files - `app.ts` and `listen.ts`:
```zsh
mkdir src && touch src/app.ts src/listen.ts
```

Add the following code to `app.ts`:
```js
import express from "express"

export const app = express()

app.use(express.json())

app.get("/", (_req, res) => {
  res.send("Hello, world!")
})
```

Add the following code to `listen.ts`:
```js
import { app } from "./app"

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
```

If you see an import warning, ensure `verbatimModuleSyntax` is set to `false` in `tsconfig.json`:
```json
"verbatimModuleSyntax": false
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

Check `http://localhost:3000/` - you should see **Hello, world!** displayed in the browser.

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

If you see a database not found warning when running `psql`, you may need to create a database for your username by running the following command:
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

Add the following code to `db-setup-sql` to drop and create the test and development databases:
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

Add `PGDATABASE=` plus the corresponding database name from `db-setup.sql` to each `.env` file e.g.
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

Add the following code to `index.ts` to set up dotenv configuration and a connection pool:
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

### Test data

First, we need custom types for our data. Create a `src/types` directory and add a file called `data.ts`:
```zsh
mkdir src/types && touch src/types/data.ts
```

Add and export the following example:
```ts
export type CountryData = {
  name: string
  capital: string
}
```

Create a new `db` directory:
```zsh
mkdir src/db
```

Create a `data/test` directory inside `db` and add files with raw test data. For the purposes of this example, we have created `src/db/data/test/countries.ts` with the following sample data:
```ts
export const countriesData: CountryData[] = [
  {
    name: "France",
    capital: "Paris",
  },
  {
    name: "Italy",
    capital: "Rome",
  },
  {
    name: "Spain",
    capital: "Madrid",
  },
]
```

### Seeding

Install `pg-format` and corresponding type definitions for safe dynamic SQL queries:
```zsh
npm install pg-format
```
```zsh
npm i -D @types/pg-format
```

Create a new `seeding` directory under `db` with a `seed.ts` file:
```zsh
mkdir src/db/seeding && touch src/db/seeding/seed.ts
```

Add the following code to `seed.ts` to generate a seed function. This will create and populate tables in the database(s) with the raw data in the `data` directory:
```js
import format from "pg-format"
import { db } from "../index"
import type { CountryData } from "../../types/data"

export const seed = async (countriesData: CountryData[]): Promise<void> => {

  await db.query(`
    DROP TABLE IF EXISTS countries;
    `)

  await db.query(`
    CREATE TABLE countries (
      country_id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      capital VARCHAR(100) NOT NULL,
      is_visited BOOLEAN NOT NULL DEFAULT FALSE
    );
    `)

  await db.query(format(`
    INSERT INTO countries (
      name,
      capital
    )
    VALUES %L;
    `,
    countriesData.map(country => Object.values(country))
  ))
}
```

### Development data

Create a `development` directory inside `db/data` and add files with raw development data. For the purposes of this example, we have used the same data as `src/db/data/test/countries.ts`.

To seed the development database, we will need to run the seed function using this data. Create a new `seed-db.ts` file in `src/db/seeding`:
```zsh
touch src/db/seeding/seed-db.ts
```

Add the following code to the file:
```js
import { countriesData } from "../data/development/countries"
import { db } from "../index"
import { seed } from "./seed"

const seedDatabase = async (): Promise<void> => {
  
  await seed(countriesData)

  await db.end()

  return
}

seedDatabase()
```

Add the following script to `package.json` to run and seed the development database:
```json
"seed": "tsc && node dist/db/seeding/seed-db.js"
```

## Building an endpoint

### Routes

First, update `app.ts` to include the following code:
```js
import { countriesRouter } from "./routes/countries"

// ...

app.use("/countries", countriesRouter)
```

Now, create a new `routes` directory and add a file called `countries.ts`:
```zsh
mkdir src/routes && touch src/routes/countries.ts
```

Add the following code to `routes/countries.ts`:
```js
import { Router } from "express"
import { getCountries } from "../controllers/countries"

export const countriesRouter = Router()

countriesRouter.route("/")
  .get(getCountries)
```

### Controllers

Create a new `controllers` directory and add a file called `countries.ts`:
```zsh
mkdir src/controllers && touch src/controllers/countries.ts
```

Add the following code to `controllers/countries.ts`:
```js
import { RequestHandler } from "express"
import { findAllCountries } from "../services/countries"

export const getCountries: RequestHandler = async (_req, res, next) => {

  try {
    const countries = await findAllCountries()

    res.status(200).send({ countries })
  } catch (err) {
    next(err)
  }
}
```

### Services

First, create a new file called `countries.ts` under `src/types` and add the following type:
```js
export type Country = {
  country_id: number
  name: string
  capital: string
  is_visited: boolean
}
```
We will need this type in the `findAllCountries` function in the next step.

Now, create a new `services` directory and add a file called `countries.ts`:
```zsh
mkdir src/services && touch src/services/countries.ts
```

Add the following code to `services/countries.ts`:
```js
import { QueryResult } from "pg"
import { db } from "../db"
import { Country } from "../types/countries"

export const findAllCountries = async (): Promise<Country[]> => {

  const result: QueryResult<Country> = await db.query(`
    SELECT *
    FROM countries;
    `)

  if (!result.rowCount) {
    return Promise.reject({
      status: 404,
      message: "Not Found",
      details: "No countries found"
    })
  }

  return result.rows
}
```

## Error handling

Create a new `middleware` directory and add a file called `errors.ts`:
```zsh
mkdir src/middleware && touch src/middleware/errors.ts
```

Add the following code to `errors.ts`:
```js
import { ErrorRequestHandler, RequestHandler } from "express"

const CODE_INVALID_TEXT_REPRESENTATION = "22P02"
const CODE_NOT_NULL_VIOLATION = "23502"

export const customErrorHandler: ErrorRequestHandler = (err, _req, res, next) => {

  if (err.status) {
    res.status(err.status).send({
      message: err.message,
      details: err.details
    })
  } else {
    next(err)
  }
}

export const psqlErrorHandler: ErrorRequestHandler = (err, _req, res, next) => {

  if (err.code === CODE_INVALID_TEXT_REPRESENTATION) {
    res.status(400).send({
      message: "Bad Request",
      details: "Invalid text representation"
    })
  } else if (err.code === CODE_NOT_NULL_VIOLATION) {
    res.status(400).send({
      message: "Bad Request",
      details: "Not null violation"
    })
  } else {
    next(err)
  }
}

export const serverErrorHandler: ErrorRequestHandler = (err, _req, res, _next) => {

  console.log(err.code)

  res.status(500).send({
    message: "Internal Server Error"
  })
}

export const notFoundHandler: RequestHandler = async (_req, res, next) => {

  try {
    res.status(404).send({ 
      message: "Not Found",
      details: "Path not found" 
    })
  } catch (err) {
    next(err)
  }
}
```

Now, update `app.ts` to include the following code:
```js
import { customErrorHandler, notFoundHandler, psqlErrorHandler, serverErrorHandler } from "./middleware/errors"

// ...

app.use(customErrorHandler, psqlErrorHandler, serverErrorHandler)

app.all("/*any", notFoundHandler)
```
Our app can now gracefully handle errors as well as non-existent routes.

At this point, `app.ts` should look like this:
```js
import express from "express"
import { countriesRouter } from "./routes/countries"
import { customErrorHandler, notFoundHandler, psqlErrorHandler, serverErrorHandler } from "./middleware/errors"

export const app = express()

app.use(express.json())

app.get("/", (_req, res) => {
  res.send("Hello, world!")
})

app.use("/countries", countriesRouter)

app.use(customErrorHandler, psqlErrorHandler, serverErrorHandler)

app.all("/*any", notFoundHandler)
```

## Tests

### Install and configure Jest

Install Jest and corresponding type definitions along with ts-jest:
```zsh
npm i -D jest @types/jest ts-jest
```

Run the following command to generate a config file and allow Jest to transpile TypeScript:
```zsh
npx ts-jest config:init
```

Update the test script in `package.json`:
```json
"test": "jest src/ --runInBand"
```

Add Jest to the types array in `tsconfig.json`:
```json
"types": ["jest"]
```

### Integration tests

Install SuperTest and corresponding type definitions:
```zsh
npm i -D supertest @types/supertest
```

Create a new `__tests__` directory with an `integration` directory for integration tests:
```zsh
mkdir src/__tests__ && mkdir src/__tests__/integration
```

Create a test file called `countries.test.ts` under `__tests__/integration`:
```zsh
touch src/__tests__/integration/countries.test.ts
```

Add the following example of a simple test to the test file:
```js
import { app } from "../../app"
import { db } from "../../db"
import { countriesData } from "../../db/data/test/countries"
import { seed } from "../../db/seeding/seed"
import request from "supertest"
import { Country } from "../../types/countries"

beforeEach(async () => {
  await seed(countriesData)
})

afterAll(async () => {
  await seed(countriesData)

  db.end()
})

describe("GET /countries", () => {

  test("200 OK - responds with an array of countries", async () => {

    const { body } = await request(app)
      .get("/countries")
      .expect(200)

    const countries: Country[] = body.countries

    expect(countries.length).toBe(3)

    for (const country of body.countries) {
      expect(country).toMatchObject<Country>({
        country_id: expect.any(Number),
        name: expect.any(String),
        capital: expect.any(String),
        is_visited: expect.any(Boolean),
      })
    }
  })
})
```

Run all tests with this shortcut command:
```zsh
npm t
```
