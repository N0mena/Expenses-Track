import express from 'express'
import { register } from './controllers/authController.js' 
const app = express()
app.use(express.json())

app.post('/register', register)

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000")
})
