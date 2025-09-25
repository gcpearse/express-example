import format from "pg-format"
import { db } from "../index.js"
import type { countryData } from "../data/test/countries.js"

export const seed = async (countriesData: countryData[]): Promise<void> => {

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
