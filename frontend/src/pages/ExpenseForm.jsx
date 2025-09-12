import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { mockApi } from "../services/mockApi";
import { ArrowLeft, Upload, X } from "lucide-react";

const ExpenseForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    amount: "",
    date: "",
    categoryId: "",
    description: "",
    type: "one-time",
    startDate: "",
    endDate: "",
    receiptFile: null,
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadCategories();
    if (isEditing) {
      loadExpense();
    }
  }, [id, isEditing]);

  const loadCategories = async () => {
    try {
      const categoriesData = await mockApi.getCategoriesList();
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const loadExpense = async () => {
    try {
      setInitialLoading(true);
      const expense = await mockApi.getExpense(id);
      setFormData({
        amount: expense.amount.toString(),
        date: expense.date || "",
        categoryId: expense.categoryId,
        description: expense.description || "",
        type: expense.type,
        startDate: expense.startDate || "",
        endDate: expense.endDate || "",
        receiptFile: null,
      });
    } catch (error) {
      console.error("Error loading expense:", error);
      alert("Failed to load expense");
      navigate("/expenses");
    } finally {
      setInitialLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }

    if (!formData.categoryId) {
      newErrors.categoryId = "Category is required";
    }

    if (formData.type === "one-time" && !formData.date) {
      newErrors.date = "Date is required for one-time expenses";
    }

    if (formData.type === "recurring" && !formData.startDate) {
      newErrors.startDate = "Start date is required for recurring expenses";
    }

    if (
      formData.type === "recurring" &&
      formData.endDate &&
      formData.startDate
    ) {
      if (new Date(formData.endDate) <= new Date(formData.startDate)) {
        newErrors.endDate = "End date must be after start date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0] || null,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleTypeChange = (newType) => {
    setFormData((prev) => ({
      ...prev,
      type: newType,
      date: newType === "recurring" ? "" : prev.date,
      startDate: newType === "one-time" ? "" : prev.startDate,
      endDate: newType === "one-time" ? "" : prev.endDate,
    }));
  };

  const removeReceiptFile = () => {
    setFormData((prev) => ({
      ...prev,
      receiptFile: null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const expenseData = {
        amount: parseFloat(formData.amount),
        categoryId: formData.categoryId,
        description: formData.description,
        type: formData.type,
        ...(formData.type === "one-time" && { date: formData.date }),
        ...(formData.type === "recurring" && {
          startDate: formData.startDate,
          ...(formData.endDate && { endDate: formData.endDate }),
        }),
        receiptUrl: formData.receiptFile ? formData.receiptFile.name : null,
      };

      if (isEditing) {
        await mockApi.updateExpense(id, expenseData);
      } else {
        await mockApi.createExpense(expenseData);
      }

      navigate("/expenses");
    } catch (error) {
      console.error("Error saving expense:", error);
      alert("Failed to save expense");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate("/expenses")}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Expenses
        </button>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">
          {isEditing ? "Edit Expense" : "Add New Expense"}
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
              } rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500`}
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
            htmlFor="categoryId"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Category *
          </label>
          <select
            id="categoryId"
            name="categoryId"
            className={`block w-full border ${
              errors.categoryId ? "border-red-300" : "border-gray-300"
            } rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500`}
            value={formData.categoryId}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="mt-1 text-sm text-red-600">{errors.categoryId}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description
          </label>
          <input
            type="text"
            id="description"
            name="description"
            className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter expense description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Expense Type *
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => handleTypeChange("one-time")}
              className={`p-4 border-2 rounded-lg text-left transition-colors ${
                formData.type === "one-time"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="font-medium text-gray-900">One-time</div>
              <div className="text-sm text-gray-500">
                Single expense with specific date
              </div>
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange("recurring")}
              className={`p-4 border-2 rounded-lg text-left transition-colors ${
                formData.type === "recurring"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="font-medium text-gray-900">Recurring</div>
              <div className="text-sm text-gray-500">
                Repeating expense with date range
              </div>
            </button>
          </div>
        </div>

        {formData.type === "one-time" && (
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
              } rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500`}
              value={formData.date}
              onChange={handleChange}
              required
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-600">{errors.date}</p>
            )}
          </div>
        )}

        {formData.type === "recurring" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Start Date *
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                className={`block w-full border ${
                  errors.startDate ? "border-red-300" : "border-gray-300"
                } rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500`}
                value={formData.startDate}
                onChange={handleChange}
                required
              />
              {errors.startDate && (
                <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="endDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                End Date (Optional)
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                className={`block w-full border ${
                  errors.endDate ? "border-red-300" : "border-gray-300"
                } rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500`}
                value={formData.endDate}
                onChange={handleChange}
              />
              {errors.endDate && (
                <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Leave empty for ongoing recurring expense
              </p>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Receipt (Optional)
          </label>
          {formData.receiptFile ? (
            <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-md">
              <span className="text-sm text-gray-700">
                {formData.receiptFile.name}
              </span>
              <button
                type="button"
                onClick={removeReceiptFile}
                className="text-red-600 hover:text-red-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="border-2 border-gray-300 border-dashed rounded-md p-6">
              <div className="text-center">
                <Upload className="mx-auto h-8 w-8 text-gray-400" />
                <div className="mt-2">
                  <label htmlFor="receiptFile" className="cursor-pointer">
                    <span className="text-sm text-blue-600 hover:text-blue-500">
                      Upload a receipt
                    </span>
                    <input
                      id="receiptFile"
                      name="receiptFile"
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      className="sr-only"
                      onChange={handleChange}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  JPG, PNG, PDF up to 5MB
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate("/expenses")}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {isEditing ? "Updating..." : "Creating..."}
              </div>
            ) : isEditing ? (
              "Update Expense"
            ) : (
              "Create Expense"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;
