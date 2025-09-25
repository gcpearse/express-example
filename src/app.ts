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
