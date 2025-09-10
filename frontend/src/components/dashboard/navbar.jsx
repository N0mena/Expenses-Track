// src/components/UI/Navbar.jsx
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center sticky top-0 z-50">
      <div className="text-xl font-bold text-pink-600">Expense Tracker</div>

      <div className="flex gap-4">
        <Link href="/">
          <p className="px-3 py-1 rounded hover:bg-pink-100 transition">
            Dashboard
          </p>
        </Link>

        <Link href="/newIncome">
          <p className="px-3 py-1 rounded hover:bg-green-100 transition">
            Add Income
          </p>
        </Link>

        <Link href="/newExpense">
          <p className="px-3 py-1 rounded hover:bg-red-100 transition">
            Add Expense
          </p>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
