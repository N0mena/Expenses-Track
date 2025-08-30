import { useState } from 'react'
import './App.css'
import ExpenseForm from './components/ExpenseForm'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <ExpenseForm/>
    </>
  )
}

export default App
