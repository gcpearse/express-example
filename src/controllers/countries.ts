import { RequestHandler } from "express"
import { findAllCountries } from "../services/countries"

export const getCountries: RequestHandler = async (_req, res, next) => {

  try {
    const countries = await findAllCountries()

    res.status(200).send({ countries })
  } catch (err) {
    next(err)
  }
}
