import { app } from "./app"

// If the PORT env variable is not set, the port defaults to 3000
const port = process.env.PORT || 3000

// Starts the server and listens for incoming requests
app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
