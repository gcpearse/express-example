import express from "express"
import { countriesRouter } from "./routes/countries"
import { customErrorHandler, notFoundHandler, psqlErrorHandler, serverErrorHandler } from "./middleware/errors"

// The top-level express() function creates an Express application
export const app = express()

// Call app.use() to load a middleware function
// The express.json() middleware function parses JSON payloads from incoming requests
app.use(express.json())

// The top-level app function can call any HTTP method directly
app.get("/", (_req, res) => {
  res.send("Hello, world!")
})

// In this more advanced example, we load a router
// The router then calls a controller with an HTTP method
// Finally, the controller calls a service to query the database and returns a response
app.use("/countries", countriesRouter)

// If there is an error, the controller will call the next error handling middleware function
app.use(customErrorHandler, psqlErrorHandler, serverErrorHandler)

// Here, calling app.all() loads notFoundHandler for all HTTP methods on any route not handled above
app.all("/*any", notFoundHandler)
