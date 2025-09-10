import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "tailwindcss";

const COLORS = [
  "#10B981",
  "#EF4444",
  "#3B82F6",
  "#F59E0B",
  "#8B5CF6",
  "#EC4899",
];

const CategoryChart = ({ data = [] }) => {
  return (
    <div className="w-full h-70 my-5 bg-white rounded-2xl shadow p-4">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">
        Expenses by Category
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `$${value}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryChart;
