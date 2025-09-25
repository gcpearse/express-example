import { countriesData } from "../data/development/countries.js"
import { db } from "../index.js"
import { seed } from "./seed.js"

const seedDatabase = async (): Promise<void> => {
  
  await seed(countriesData)

  await db.end()

  return
}

seedDatabase()
