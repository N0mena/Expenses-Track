import { useState } from 'react'
import './App.css'
import ExpenseForm from './components/ExpenseForm'
import ExpenseItem from './components/ExpenseItem'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <ExpenseItem/>
    </>
  )
}

export default App
