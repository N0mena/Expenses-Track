import Link from "next/link";
import { useState } from "react";
import NewIncome from "./newIncome";
import NewExpense from "./newExpense";


const Navbar = () => {
  const [isIncomeOpen, setIsIncomeOpen] = useState(false);
  const [isExpenseOpen, setIsExpenseOpen] = useState(false);

  return (
    <div>
    <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center sticky top-0 z-50">
      <div className="text-xl font-bold text-pink-600">Expense Tracker</div>

      <div className="flex gap-4">
        <Link href="/">
          <p className="px-3 py-1 rounded hover:bg-pink-100 transition">
            Dashboard
          </p>
        </Link>

        <Link href="/newIncome">
          <p
            className="px-3 py-1 rounded hover:bg-green-100 transition"
            onClick={() => setIsIncomeOpen(true)}
          >
            Add Income
          </p>
        </Link>

        <Link href="/newExpense">
          <p
            className="px-3 py-1 rounded hover:bg-red-100 transition"
            onClick={() => setIsExpenseOpen(true)}
          >
            Add Expense
          </p>
        </Link>
      </div>
    </nav>
     {isIncomeOpen && (
        <NewIncome
          isOpen={isIncomeOpen}
          onClose={() => setIsIncomeOpen(false)} 
        />
      )}
     {isExpenseOpen && (
        <NewExpense
          isOpen={isExpenseOpen}
          onClose={() => setIsExpenseOpen(false)} 
        />
      )}
    </div>
  );
};

export default Navbar;
