import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { mockApi } from "../services/mockApi";
import { ArrowLeft } from "lucide-react";

const IncomeForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    amount: "",
    date: "",
    source: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditing) {
      loadIncome();
    }
  }, [id, isEditing]);

  const loadIncome = async () => {
    try {
      setInitialLoading(true);
      const income = await mockApi.getIncome(id);
      setFormData({
        amount: income.amount.toString(),
        date: income.date,
        source: income.source,
        description: income.description || "",
      });
    } catch (error) {
      console.error("Error loading income:", error);
      alert("Failed to load income");
      navigate("/incomes");
    } finally {
      setInitialLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }

    if (!formData.date) {
      newErrors.date = "Date is required";
    }

    if (!formData.source.trim()) {
      newErrors.source = "Source is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const incomeData = {
        amount: parseFloat(formData.amount),
        date: formData.date,
        source: formData.source.trim(),
        description: formData.description.trim(),
      };

      if (isEditing) {
        await mockApi.updateIncome(id, incomeData);
      } else {
        await mockApi.createIncome(incomeData);
      }

      navigate("/incomes");
    } catch (error) {
      console.error("Error saving income:", error);
      alert("Failed to save income");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate("/incomes")}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Income
        </button>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">
          {isEditing ? "Edit Income" : "Add New Income"}
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-lg p-6 space-y-6"
      >
        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Amount *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              id="amount"
              name="amount"
              step="0.01"
              min="0"
              className={`pl-7 block w-full border ${
                errors.amount ? "border-red-300" : "border-gray-300"
              } rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500`}
              placeholder="0.00"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>
          {errors.amount && (
            <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Date *
          </label>
          <input
            type="date"
            id="date"
            name="date"
            className={`block w-full border ${
              errors.date ? "border-red-300" : "border-gray-300"
            } rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500`}
            value={formData.date}
            onChange={handleChange}
            required
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-600">{errors.date}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="source"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Source *
          </label>
          <input
            type="text"
            id="source"
            name="source"
            className={`block w-full border ${
              errors.source ? "border-red-300" : "border-gray-300"
            } rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500`}
            placeholder="e.g., Salary, Freelance, Investment"
            value={formData.source}
            onChange={handleChange}
            required
          />
          {errors.source && (
            <p className="mt-1 text-sm text-red-600">{errors.source}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Enter additional details about this income"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate("/incomes")}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {isEditing ? "Updating..." : "Creating..."}
              </div>
            ) : isEditing ? (
              "Update Income"
            ) : (
              "Create Income"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default IncomeForm;
