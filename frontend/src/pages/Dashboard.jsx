import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { mockApi } from "../services/mockApi";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  Plus,
  AlertTriangle,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  addMonths,
  subMonths,
} from "date-fns";
import ExpensePieChart from "../components/charts/ExpensePieChart";
import MonthlyBarChart from "../components/charts/MonthlyBarChart";

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  useEffect(() => {
    loadDashboardData();
  }, [selectedMonth]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const monthStr = format(selectedMonth, "yyyy-MM");

      const [summaryData, alertsData, categoriesData] = await Promise.all([
        mockApi.getMonthlySummary(monthStr),
        mockApi.getAlerts(),
        mockApi.getCategoriesList(),
      ]);

      const startDate = format(startOfMonth(selectedMonth), "yyyy-MM-dd");
      const endDate = format(endOfMonth(selectedMonth), "yyyy-MM-dd");

      const [expensesData, incomesData] = await Promise.all([
        mockApi.getExpensesList({ start: startDate, end: endDate }),
        mockApi.getIncomesList({ start: startDate, end: endDate }),
      ]);

      setSummary(summaryData);
      setAlerts(alertsData);
      setExpenses(expensesData);
      setIncomes(incomesData);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const navigateMonth = (direction) => {
    setSelectedMonth((prev) =>
      direction === "prev" ? subMonths(prev, 1) : addMonths(prev, 1)
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const isCurrentMonth =
    format(selectedMonth, "yyyy-MM") === format(new Date(), "yyyy-MM");

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <h1 className="text-3xl font-light text-slate-800">Overview</h1>
          <div className="flex items-center space-x-1 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 px-4 py-2.5 shadow-sm">
            <button
              onClick={() => navigateMonth("prev")}
              className="p-1.5 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <ChevronLeft className="h-4 w-4 text-slate-600" />
            </button>
            <div className="flex items-center space-x-2 px-3">
              <Calendar className="h-4 w-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-700 min-w-[120px] text-center">
                {format(selectedMonth, "MMMM yyyy")}
              </span>
            </div>
            <button
              onClick={() => navigateMonth("next")}
              className="p-1.5 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <ChevronRight className="h-4 w-4 text-slate-600" />
            </button>
          </div>
        </div>

        <div className="flex space-x-3">
          <Link
            to="/expenses/new"
            className="inline-flex items-center px-5 py-2.5 text-sm font-medium rounded-2xl text-white bg-emerald-800 hover:bg-[#1fbfb8] transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Expense
          </Link>
          <Link
            to="/incomes/new"
            className="inline-flex items-center px-5 py-2.5 border border-slate-200 text-sm font-medium rounded-2xl text-slate-700 bg-white/80 backdrop-blur-sm hover:bg-white hover:border-slate-300 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Income
          </Link>
        </div>
      </div>

      {alerts.length > 0 && (
        <div className="space-y-3">
          {alerts.map((alert, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-100/50 rounded-2xl p-5 shadow-sm"
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-semibold text-red-900">
                    Budget Alert
                  </h3>
                  <p className="text-sm text-red-700 mt-1">{alert.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/70 backdrop-blur-sm border border-slate-200/60 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">
                Total Income
              </p>
              <p className="text-2xl font-light text-slate-900">
                Ar {summary?.totalIncome?.toFixed(2) || "0.00"}
              </p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm border border-slate-200/60 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">
                Total Expenses
              </p>
              <p className="text-2xl font-light text-slate-900">
                Ar {summary?.totalExpenses?.toFixed(2) || "0.00"}
              </p>
            </div>
            <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-rose-600" />
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm border border-slate-200/60 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">Balance</p>
              <p
                className={`text-2xl font-light ${
                  (summary?.balance || 0) >= 0
                    ? "text-emerald-600"
                    : "text-rose-600"
                }`}
              >
                Ar {summary?.balance?.toFixed(2) || "0.00"}
              </p>
            </div>
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                (summary?.balance || 0) >= 0 ? "bg-emerald-100" : "bg-rose-100"
              }`}
            >
              <DollarSign
                className={`h-6 w-6 ${
                  (summary?.balance || 0) >= 0
                    ? "text-emerald-600"
                    : "text-rose-600"
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/70 backdrop-blur-sm border border-slate-200/60 rounded-3xl p-8 shadow-sm hover:shadow-md transition-all duration-300">
          <h3 className="text-lg font-medium text-slate-800 mb-6">
            Expenses by Category
          </h3>
          <ExpensePieChart expenses={expenses} categories={categories} />
        </div>

        <div className="bg-white/70 backdrop-blur-sm border border-slate-200/60 rounded-3xl p-8 shadow-sm hover:shadow-md transition-all duration-300">
          <h3 className="text-lg font-medium text-slate-800 mb-6">
            Monthly Overview
          </h3>
          <MonthlyBarChart selectedMonth={selectedMonth} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/70 backdrop-blur-sm border border-slate-200/60 rounded-3xl p-8 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-slate-800">
              Recent Expenses
            </h3>
            <Link
              to="/expenses"
              className="text-sm text-slate-600 hover:text-slate-800 font-medium transition-colors"
            >
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {expenses.slice(0, 5).map((expense) => {
              const category = categories.find(
                (c) => c.id === expense.categoryId
              );
              return (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">
                      {expense.description || "No description"}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {category?.name} •{" "}
                      {expense.type === "recurring"
                        ? "Recurring"
                        : expense.date}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-rose-600">
                    -Ar {expense.amount.toFixed(2)}
                  </span>
                </div>
              );
            })}
            {expenses.length === 0 && (
              <p className="text-sm text-slate-500 text-center py-8">
                No expenses for this month
              </p>
            )}
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm border border-slate-200/60 rounded-3xl p-8 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-slate-800">
              Recent Income
            </h3>
            <Link
              to="/incomes"
              className="text-sm text-slate-600 hover:text-slate-800 font-medium transition-colors"
            >
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {incomes.slice(0, 5).map((income) => (
              <div
                key={income.id}
                className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50/50 transition-colors"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">
                    {income.description || income.source}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {income.source} • {income.date}
                  </p>
                </div>
                <span className="text-sm font-semibold text-emerald-600">
                  +Ar {income.amount.toFixed(2)}
                </span>
              </div>
            ))}
            {incomes.length === 0 && (
              <p className="text-sm text-slate-500 text-center py-8">
                No income for this month
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
