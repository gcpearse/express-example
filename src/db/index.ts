import dotenv from "dotenv"
import { Pool } from "pg"

const ENV = process.env.NODE_ENV || "development"

dotenv.config({
  path: `${__dirname}/../../.env.${ENV}`
})

if (!process.env.PGDATABASE) {
  throw new Error("PGDATABASE env variable not set")
}

// Creates a database connection pool
export const db = new Pool()
