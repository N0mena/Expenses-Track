  import 'tailwindcss'

const BudgetProgress = ({ spent = 0, budget = 0 }) => {
  const percentage = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;

  return (
    <div className="w-full my-5 bg-white rounded-2xl shadow p-4">
      <h2 className="text-lg font-semibold text-gray-700 mb-2">Budget Usage</h2>

      <div className="flex justify-between text-sm text-gray-600 mb-1">
        <span>Spent: ${spent.toLocaleString()}</span>
        <span>Budget: ${budget.toLocaleString()}</span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-4">
        <div
          className={`h-4 rounded-full transition-all duration-500 ${
            percentage < 70
              ? "bg-green-500"
              : percentage < 100
              ? "bg-yellow-500"
              : "bg-red-500"
          }`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>

      <p className="text-sm text-gray-500 mt-2">
        {percentage.toFixed(0)}
      </p>
    </div>
  );
};

export default BudgetProgress;
