import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute.jsx";
import { Layout } from "./components/layout/Layout";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import ExpenseForm from "./pages/ExpenseForm";
import Incomes from "./pages/Incomes";
import IncomeForm from "./pages/IncomeForm";
import Categories from "./pages/Categories";
import Profile from "./pages/Profile";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/expenses"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Expenses />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/expenses/new"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ExpenseForm />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/expenses/:id/edit"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ExpenseForm />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/incomes"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Incomes />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/incomes/new"
              element={
                <ProtectedRoute>
                  <Layout>
                    <IncomeForm />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/incomes/:id/edit"
              element={
                <ProtectedRoute>
                  <Layout>
                    <IncomeForm />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/categories"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Categories />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Profile />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

