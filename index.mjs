import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const app = express()
const port = process.env.PORT || 8080

app.use(express.static('public'))

app.get('*', (req, res, next) => {
  if (req.path === '/') {
    res.sendFile(`${__dirname}/public/index.html`)
  } else {
    res.sendFile(`${__dirname}/public/resource.html`)
  }
  console.log(req.path)
})

app.listen(port, () => {
  console.log(`Your app is listening to port ${port}`)
})
