import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const ExpensePieChart = ({ expenses, categories }) => {
  const categoryTotals = {};

  expenses.forEach((expense) => {
    const categoryId = expense.categoryId;
    if (!categoryTotals[categoryId]) {
      categoryTotals[categoryId] = 0;
    }
    categoryTotals[categoryId] += expense.amount;
  });

  const chartData = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [
          "#3B82F6",
          "#EF4444",
          "#10B981",
          "#F59E0B",
          "#8B5CF6",
          "#EC4899",
          "#6B7280",
          "#14B8A6",
        ],
        borderWidth: 2,
        borderColor: "#ffffff",
      },
    ],
  };

  Object.entries(categoryTotals).forEach(([categoryId, total]) => {
    const category = categories.find((c) => c.id === categoryId);
    chartData.labels.push(category?.name || "Unknown");
    chartData.datasets[0].data.push(total);
  });

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: $${context.parsed.toFixed(
              2
            )} (${percentage}%)`;
          },
        },
      },
    },
  };

  if (chartData.labels.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>No expense data available</p>
      </div>
    );
  }

  return (
    <div className="h-64">
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default ExpensePieChart;
