import { countriesData } from "../data/development/countries"
import { db } from "../index"
import { seed } from "./seed"

// Seeds the database then ends the connection
const seedDatabase = async (): Promise<void> => {
  
  await seed(countriesData)

  await db.end()

  return
}

seedDatabase()
