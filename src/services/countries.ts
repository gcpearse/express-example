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
