import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { useState, useEffect } from "react";
import { mockApi } from "../../services/mockApi.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const MonthlyBarChart = ({ selectedMonth }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChartData();
  }, [selectedMonth]);

  const loadChartData = async () => {
    try {
      setLoading(true);

      const months = [];
      const incomeData = [];
      const expenseData = [];

      for (let i = 5; i >= 0; i--) {
        const month = subMonths(selectedMonth, i);
        const monthStr = format(month, "yyyy-MM");
        months.push(format(month, "MMM yyyy"));

        try {
          const summary = await mockApi.getMonthlySummary(monthStr);
          incomeData.push(summary.totalIncome);
          expenseData.push(summary.totalExpenses);
        } catch (error) {
          incomeData.push(0);
          expenseData.push(0);
        }
      }

      setChartData({
        labels: months,
        datasets: [
          {
            label: "Income",
            data: incomeData,
            backgroundColor: "#10B981",
            borderColor: "#059669",
            borderWidth: 1,
          },
          {
            label: "Expenses",
            data: expenseData,
            backgroundColor: "#EF4444",
            borderColor: "#DC2626",
            borderWidth: 1,
          },
        ],
      });
    } catch (error) {
      console.error("Error loading chart data:", error);
    } finally {
      setLoading(false);
    }
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: $${context.parsed.y.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return "$" + value.toFixed(0);
          },
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!chartData) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>No data available</p>
      </div>
    );
  }

  return (
    <div className="h-64">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default MonthlyBarChart;
