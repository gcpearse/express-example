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
