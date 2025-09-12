
const RecentTransactions = ({ transactions = [] }) => {
  return (
    <div className="w-full bg-blue-50 rounded-2xl shadow p-4">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">
        Recent Transactions
      </h2>

      <ul className="divide-y divide-gray-200">
        {transactions.length === 0 ? (
          <p className="text-gray-500 text-sm">No recent transactions</p>
        ) : (
          transactions.map((tx) => (
            <li key={tx.id} className="flex justify-between items-center py-2">
              <div>
                <p className="text-sm font-medium text-gray-800">{tx.title}</p>
                <p className="text-xs text-gray-500">{tx.date}</p>
              </div>
              <p
                className={`text-sm font-bold ${
                  tx.amount >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {tx.amount >= 0 ? "+" : "-"}${Math.abs(tx.amount).toFixed(2)}
              </p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default RecentTransactions;
