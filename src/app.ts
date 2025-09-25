import express from "express"
import { countriesRouter } from "./routes/countries"
import { customErrorHandler, notFoundHandler, psqlErrorHandler, serverErrorHandler } from "./middleware/errors"

// This top-level function creates an Express application
export const app = express()

// Call app.use() to load a middleware function
// The express.json() middleware function parses JSON payloads from incoming requests
app.use(express.json())

// The app function can call any HTTP method
app.get("/", (_req, res) => {
  res.send("Hello, world!")
})

app.use("/countries", countriesRouter)

app.use(customErrorHandler, psqlErrorHandler, serverErrorHandler)

// Calling app.all() here loads notFoundHandler for all HTTP methods on any route not handled above
app.all("/*any", notFoundHandler)
