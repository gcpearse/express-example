# Express example

## Contents

- [Initial setup](#initial-setup)
- [Express setup](#express-setup)

## Initial setup

### Initialisation

Initialise a new Node project:
```zsh
npm init -y
```

### TypeScript

Install TypeScript:
```zsh
npm i -D typescript
```

Create a `tsconfig.json` file:
```zsh
npx tsc --init
```

Enable the following:
- `"rootDir": "./src"`
- `"outDir": "./dist"` 
- `"noImplicitReturns": true` to flag code paths that do not return a value
- `"noUnusedLocals": true` to flag variables that are declared but never read
- `"noUnusedParameters": true` to flag parameters that are declared but never read

Install type definitions for Node:
```zsh
npm i -D @types/node
```

## Express setup

Install Express and type definitions:
```zsh
npm install express
```
```zsh
npm i -D @types/express
```

Create a `src` directory with two files to begin with:
```zsh
mkdir src
```
```zsh
touch src/app.ts && touch listen.ts
```

Add the following code to `app.ts`:
```js
import express from "express"

export const app = express()

app.get('/', (_req, res) => {
  res.send('Hello, world!')
})
```

Add the following code to `listen.ts`:
```js
import { app } from "./app.js"

const port = 3000

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
```

If you see an import warning, try adding the following code to `package.json`:
```json
"type": "module"
```

In `package.json`, make `listen.js` the primary entry point:
```json
"main": "listen.js"
```

Add the following script to `package.json`:
```json
"start": "tsc && node dist/listen.js"
```
> This will compile the code and start the server
