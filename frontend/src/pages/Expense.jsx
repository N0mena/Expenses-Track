import { useState } from "react";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseItem from "../components/ExpenseItem";

function Expense() {
  const [expenses, setExpenses] = useState([]);
  const onAddExpense = (expenseData) => {
    setExpenses((prevExpenses) => [expenseData, ...prevExpenses]);
  };

  return (
    <>
      <h1> Expenses pages </h1>
      <ExpenseForm onAddExpense={onAddExpense} />
      {expenses.length === 0 ? (
        <p>No added expense </p>
      ) : (
        expenses.map((expense) => (
          <ExpenseItem key={expense.id} expense={expense} />
        ))
      )}
    </>
  );
}
export default Expense;
