import { useState } from "react";
import { useNavigate } from "react-router-dom";

const NewIncome = () => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !amount || !date) return alert("Please fill all fields");


    console.log("New Income:", { title, amount, date });
    setTitle("");
    setAmount("");

  };

  return (
    <div className="p-6 max-w-md w-full my-5 bg-white rounded-2xl shadow text-black">
      <h1 className="text-xl font-bold mb-4">Add New Income</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Income Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <button
          type="submit"
          className="bg-green-500 text-white rounded-lg py-2 hover:bg-green-600 transition"
        >
          Add Income
        </button>
      </form>
    </div>
  );
};

export default NewIncome;
