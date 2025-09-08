import express from 'express'
import { createExpense } from './controllers/expenseController.js'
import { getExpense } from './controllers/expenseController.js'
const app = express()
app.use(express.json())

app.get('/expense', getExpense)
app.post('/expense', createExpense)



app.listen(3000, () => {
  console.log("Server running on http://localhost:3000")
})
