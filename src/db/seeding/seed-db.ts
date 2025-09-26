import { data } from "../data/dev-data"
import { db } from "../index"
import { seed } from "./seed"

// Seeds the database then ends the connection
const seedDatabase = async (): Promise<void> => {
  
  await seed(data)

  await db.end()

  return
}

seedDatabase()
