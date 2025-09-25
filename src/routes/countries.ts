import { Router } from "express"
import { getCountries } from "../controllers/countries"

export const countriesRouter = Router()

countriesRouter.route("/")
  .get(getCountries)
