// src/pages/NewExpense.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const NewExpense = () => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("Food");


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !amount || !date || !category)
      return alert("Please fill all fields");

    console.log("New Expense:", { title, amount, date, category });

    setTitle("");
    setAmount("");
    setDate("");
    setCategory("Food");

  };

  return (
    <div className="p-6 max-w-md my-5 w-full bg-white rounded-2xl shadow text-black">
      <h1 className="text-xl font-bold mb-4">Add New Expense</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Expense Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-400"
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-400"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-400"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Rent">Rent</option>
          <option value="Shopping">Shopping</option>
          <option value="Other">Other</option>
        </select>
        <button
          type="submit"
          className="bg-red-500 text-white rounded-lg py-2 hover:bg-red-600 transition"
        >
          Add Expense
        </button>
      </form>
    </div>
  );
};

export default NewExpense;
