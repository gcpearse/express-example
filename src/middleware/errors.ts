import { ErrorRequestHandler, RequestHandler } from "express"

// Common PostgreSQL error codes (see docs for more examples)
const CODE_INVALID_TEXT_REPRESENTATION = "22P02"
const CODE_NOT_NULL_VIOLATION = "23502"

// The next function calls the next middleware function in the order of succession
// In this case, if err.status is falsy, customErrorHandler will call psqlErrorHandler
export const customErrorHandler: ErrorRequestHandler = (err, _req, res, next) => {

  if (err.status) {
    res.status(err.status).send({
      message: err.message,
      details: err.details
    })
  } else {
    next(err)
  }
}

export const psqlErrorHandler: ErrorRequestHandler = (err, _req, res, next) => {

  if (err.code === CODE_INVALID_TEXT_REPRESENTATION) {
    res.status(400).send({
      message: "Bad Request",
      details: "Invalid text representation"
    })
  } else if (err.code === CODE_NOT_NULL_VIOLATION) {
    res.status(400).send({
      message: "Bad Request",
      details: "Not null violation"
    })
  } else {
    next(err)
  }
}

// If all previous middleware functions have been exhausted, serverErrorHandler is called and sends a 500 error
export const serverErrorHandler: ErrorRequestHandler = (err, _req, res, _next) => {

  console.log(err.code)

  res.status(500).send({
    message: "Internal Server Error"
  })
}

export const notFoundHandler: RequestHandler = async (_req, res, next) => {

  try {
    res.status(404).send({ 
      message: "Not Found",
      details: "Path not found" 
    })
  } catch (err) {
    next(err)
  }
}
