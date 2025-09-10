import { ArrowUpCircle, ArrowDownCircle, Wallet } from "lucide-react";

const SummaryCards = ({ income = 0, expenses = 0 }) => {
  const balance = income - expenses;

  const cards = [
    {
      title: "Income",
      value: income,
      icon: <ArrowUpCircle className="w-6 h-6 text-green-500" />,
      bg: "bg-green-50",
    },
    {
      title: "Expenses",
      value: expenses,
      icon: <ArrowDownCircle className="w-6 h-6 text-red-500" />,
      bg: "bg-red-50",
    },
    {
      title: "Balance",
      value: balance,
      icon: <Wallet className="w-6 h-6 text-blue-500" />,
      bg: "bg-blue-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`${card.bg} p-4 rounded-2xl shadow-sm flex items-center justify-between`}
        >
          <div>
            <h3 className="text-sm font-medium text-gray-500">{card.title}</h3>
            <p className="text-2xl font-bold text-gray-800">
              ${card.value.toLocaleString()}
            </p>
          </div>
          <div className="p-3 bg-white rounded-full shadow">{card.icon}</div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;