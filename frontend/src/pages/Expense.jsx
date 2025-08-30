import { useState } from 'react'
import ExpenseForm from './components/ExpenseForm'

function Expense() {
  const [count, setCount] = useState(0)

  return (
    <>
    <ExpenseForm/>
    </>
  )
}

export default Expense;