// Mock API service to simulate backend functionality
import { 
  mockUsers, 
  mockCategories, 
  mockExpenses, 
  mockIncomes, 
  delay, 
  generateId, 
  mockJWTToken,
  STORAGE_KEYS 
} from '../data/mockData.js';

class MockApiService {
  constructor() {
    this.initializeLocalStorage();
  }

  initializeLocalStorage() {
    // Initialize local storage with mock data if not exists
    if (!localStorage.getItem(STORAGE_KEYS.EXPENSES)) {
      localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(mockExpenses));
    }
    if (!localStorage.getItem(STORAGE_KEYS.INCOMES)) {
      localStorage.setItem(STORAGE_KEYS.INCOMES, JSON.stringify(mockIncomes));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(mockCategories));
    }
  }


  getCurrentUser() {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (!token) return null;
    return mockUsers[0]; 
  }

  getExpenses() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.EXPENSES) || '[]');
  }

  getIncomes() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.INCOMES) || '[]');
  }

  getCategories() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES) || '[]');
  }

  saveExpenses(expenses) {
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
  }

  saveIncomes(incomes) {
    localStorage.setItem(STORAGE_KEYS.INCOMES, JSON.stringify(incomes));
  }

  saveCategories(categories) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }


  async signup(email, password) {
    await delay(500); 
    
    // Check if user already exists
    const existingUser = mockUsers.find(user => user.email === email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // For demo purposes, we'll just return success
    return {
      success: true,
      message: 'User created successfully',
      token: mockJWTToken
    };
  }

  async login(email, password) {
    await delay(500);
    
    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, mockJWTToken);
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));

    return {
      success: true,
      token: mockJWTToken,
      user: { id: user.id, email: user.email, profile: user.profile }
    };
  }

  async logout() {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    return { success: true };
  }

  async getMe() {
    await delay(200);
    const user = this.getCurrentUser();
    if (!user) throw new Error('Not authenticated');
    
    return {
      id: user.id,
      email: user.email,
      profile: user.profile,
      createdAt: user.createdAt
    };
  }

  // Expense API methods
  async getExpensesList(filters = {}) {
    await delay(300);
    const user = this.getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    let expenses = this.getExpenses().filter(exp => exp.userId === user.id);
    
    // Apply filters
    if (filters.start && filters.end) {
      expenses = expenses.filter(exp => {
        if (exp.type === 'one-time') {
          return exp.date >= filters.start && exp.date <= filters.end;
        }
        // For recurring expenses, check if they're active in the date range
        return (!exp.endDate || exp.endDate >= filters.start) && exp.startDate <= filters.end;
      });
    }
    
    if (filters.category) {
      expenses = expenses.filter(exp => exp.categoryId === filters.category);
    }
    
    if (filters.type) {
      expenses = expenses.filter(exp => exp.type === filters.type);
    }

    return expenses;
  }

  async getExpense(id) {
    await delay(200);
    const user = this.getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    const expenses = this.getExpenses();
    const expense = expenses.find(exp => exp.id === id && exp.userId === user.id);
    
    if (!expense) throw new Error('Expense not found');
    return expense;
  }

  async createExpense(expenseData) {
    await delay(400);
    const user = this.getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    const expenses = this.getExpenses();
    const newExpense = {
      id: `exp-${generateId()}`,
      userId: user.id,
      ...expenseData,
      createdAt: new Date().toISOString()
    };

    expenses.push(newExpense);
    this.saveExpenses(expenses);
    
    return newExpense;
  }

  async updateExpense(id, expenseData) {
    await delay(400);
    const user = this.getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    const expenses = this.getExpenses();
    const index = expenses.findIndex(exp => exp.id === id && exp.userId === user.id);
    
    if (index === -1) throw new Error('Expense not found');
    
    expenses[index] = { ...expenses[index], ...expenseData };
    this.saveExpenses(expenses);
    
    return expenses[index];
  }

  async deleteExpense(id) {
    await delay(300);
    const user = this.getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    const expenses = this.getExpenses();
    const filteredExpenses = expenses.filter(exp => !(exp.id === id && exp.userId === user.id));
    
    if (filteredExpenses.length === expenses.length) {
      throw new Error('Expense not found');
    }
    
    this.saveExpenses(filteredExpenses);
    return { success: true };
  }

  // Income API methods
  async getIncomesList(filters = {}) {
    await delay(300);
    const user = this.getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    let incomes = this.getIncomes().filter(inc => inc.userId === user.id);
    
    if (filters.start && filters.end) {
      incomes = incomes.filter(inc => inc.date >= filters.start && inc.date <= filters.end);
    }

    return incomes;
  }

  async createIncome(incomeData) {
    await delay(400);
    const user = this.getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    const incomes = this.getIncomes();
    const newIncome = {
      id: `inc-${generateId()}`,
      userId: user.id,
      ...incomeData,
      createdAt: new Date().toISOString()
    };

    incomes.push(newIncome);
    this.saveIncomes(incomes);
    
    return newIncome;
  }

  async updateIncome(id, incomeData) {
    await delay(400);
    const user = this.getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    const incomes = this.getIncomes();
    const index = incomes.findIndex(inc => inc.id === id && inc.userId === user.id);
    
    if (index === -1) throw new Error('Income not found');
    
    incomes[index] = { ...incomes[index], ...incomeData };
    this.saveIncomes(incomes);
    
    return incomes[index];
  }

  async getIncome(id) {
    await delay(200);
    const user = this.getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    const incomes = this.getIncomes();
    const income = incomes.find(inc => inc.id === id && inc.userId === user.id);
    
    if (!income) throw new Error('Income not found');
    return income;
  }

  async deleteIncome(id) {
    await delay(300);
    const user = this.getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    const incomes = this.getIncomes();
    const filteredIncomes = incomes.filter(inc => !(inc.id === id && inc.userId === user.id));
    
    if (filteredIncomes.length === incomes.length) {
      throw new Error('Income not found');
    }
    
    this.saveIncomes(filteredIncomes);
    return { success: true };
  }

  // Category API methods
  async getCategoriesList() {
    await delay(200);
    const user = this.getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    return this.getCategories().filter(cat => cat.userId === user.id);
  }

  async createCategory(categoryData) {
    await delay(300);
    const user = this.getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    const categories = this.getCategories();
    const newCategory = {
      id: `cat-${generateId()}`,
      userId: user.id,
      isDefault: false,
      ...categoryData
    };

    categories.push(newCategory);
    this.saveCategories(categories);
    
    return newCategory;
  }

  async updateCategory(id, categoryData) {
    await delay(300);
    const user = this.getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    const categories = this.getCategories();
    const index = categories.findIndex(cat => cat.id === id && cat.userId === user.id);
    
    if (index === -1) throw new Error('Category not found');
    
    categories[index] = { ...categories[index], ...categoryData };
    this.saveCategories(categories);
    
    return categories[index];
  }

  async deleteCategory(id) {
    await delay(300);
    const user = this.getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    // Check if category is in use
    const expenses = this.getExpenses();
    const isInUse = expenses.some(exp => exp.categoryId === id && exp.userId === user.id);
    
    if (isInUse) {
      throw new Error('Cannot delete category that is in use');
    }

    const categories = this.getCategories();
    const filteredCategories = categories.filter(cat => !(cat.id === id && cat.userId === user.id));
    
    if (filteredCategories.length === categories.length) {
      throw new Error('Category not found');
    }
    
    this.saveCategories(filteredCategories);
    return { success: true };
  }

  async getReceipt(expenseId) {
    await delay(200);
    const user = this.getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    const expenses = this.getExpenses();
    const expense = expenses.find(exp => exp.id === expenseId && exp.userId === user.id);
    
    if (!expense || !expense.receiptUrl) {
      throw new Error('Receipt not found');
    }
    
    // For demo purposes, return a mock receipt URL
    return {
      url: `/receipts/${expense.receiptUrl}`,
      filename: expense.receiptUrl,
      contentType: 'image/jpeg'
    };
  }

  // Summary API methods
  async getMonthlySummary(month = null) {
    await delay(400);
    const user = this.getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    const now = new Date();
    const targetMonth = month ? new Date(month + '-01') : now;
    const startOfMonth = new Date(targetMonth.getFullYear(), targetMonth.getMonth(), 1);
    const endOfMonth = new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 0);

    const startDate = startOfMonth.toISOString().split('T')[0];
    const endDate = endOfMonth.toISOString().split('T')[0];

    // Get incomes for the month
    const incomes = await this.getIncomesList({ start: startDate, end: endDate });
    const totalIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0);

    // Get expenses for the month (including recurring)
    const expenses = await this.getExpensesList({ start: startDate, end: endDate });
    let totalExpenses = 0;

    expenses.forEach(exp => {
      if (exp.type === 'one-time') {
        totalExpenses += exp.amount;
      } else if (exp.type === 'recurring') {
        // Check if recurring expense is active in this month
        const expStartDate = new Date(exp.startDate);
        const expEndDate = exp.endDate ? new Date(exp.endDate) : null;
        
        if (expStartDate <= endOfMonth && (!expEndDate || expEndDate >= startOfMonth)) {
          totalExpenses += exp.amount;
        }
      }
    });

    const balance = totalIncome - totalExpenses;

    return {
      month: targetMonth.toISOString().slice(0, 7),
      totalIncome,
      totalExpenses,
      balance,
      expenseCount: expenses.length,
      incomeCount: incomes.length
    };
  }

  async getAlerts() {
    await delay(200);
    const summary = await this.getMonthlySummary();
    
    const alerts = [];
    if (summary.balance < 0) {
      alerts.push({
        type: 'budget_exceeded',
        message: `You've exceeded your monthly budget by $${Math.abs(summary.balance).toFixed(2)}`,
        severity: 'high'
      });
    }

    return alerts;
  }
}

export const mockApi = new MockApiService();
