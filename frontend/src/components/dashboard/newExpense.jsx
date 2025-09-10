import "tailwindcss";
import { useState } from "react";

const NewExpense = () => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("Food");
  const [recurring, setRecurring] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !amount || !date || !category) {
      return alert("Please fill all fields");
    }

    const expenseData = {
      title,
      amount,
      date,
      category,
      recurring,
      startDate: recurring ? startDate : null,
      endDate: recurring ? endDate : null,
    };

    console.log("New Expense:", expenseData);

    // Reset form
    setTitle("");
    setAmount("");
    setDate("");
    setCategory("Food");
    setRecurring(false);
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="p-6 max-w-md my-5 w-full bg-pink-50 rounded-2xl shadow text-black">
      <h1 className="text-xl font-bold mb-4">Add New Expense</h1>
      <div className="flex items-center gap-4 mb-4">
        <span className="font-medium">Recurring:</span>
        <button
          type="button"
          onClick={() => setRecurring(!recurring)}
          className={`px-4 py-1 rounded-md ${
            recurring
              ? "bg-green-500 text-white"
              : "bg-white border border-gray-300"
          }`}
        >
          {recurring ? "Yes" : "No"}
        </button>
      </div>

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
        <textarea
          name="description"
          placeholder="Description"
          className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-400"
        ></textarea>

        {recurring && (
          <>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>
          </>
        )}

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
