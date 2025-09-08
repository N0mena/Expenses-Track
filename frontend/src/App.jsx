import {BrowserRouter, Routes, Route} from "react-router-dom";
import './App.css'
import Expense from './pages/Expense'
import Incomes from "./pages/Incomes";
import IncomeForm from './pages/IncomeForm'


const App = () => {
  return (
 
    <BrowserRouter>
      <Routes>
        <Route path={"/expenses"} element={<Expense/>} />
        <Route path={"/incomes"} element={<Incomes/>} />
        <Route path={"/newIncome"} element={<IncomeForm/>} />
      </Routes>
    </BrowserRouter>

  )
}

export default App
