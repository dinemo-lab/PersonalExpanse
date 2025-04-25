import { useState, useEffect } from 'react';
import { LineChart, BarChart, PieChart, Cell, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar, Line } from 'recharts';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionLIst';
import CategoryPieChart from './components/CategoryPieChart';
import DashboardCards from './components/Dashboard';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BudgetForm from './components/BudgetForm';
import BudgetComparison from './components/BudgetComparision';
import SpendingInsights from './components/SpendingInsight';
import { CATEGORIES, CATEGORY_COLORS, DEFAULT_BUDGETS } from './constants';

function App() {
  const [transactions, setTransactions] = useState(() => {
    const savedTransactions = localStorage.getItem('transactions');
    return savedTransactions ? JSON.parse(savedTransactions) : [];
  });
  
  const [budgets, setBudgets] = useState(() => {
    const savedBudgets = localStorage.getItem('budgets');
    return savedBudgets ? JSON.parse(savedBudgets) : DEFAULT_BUDGETS;
  });
  
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, transactions, budgets, reports
  
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);
  
  useEffect(() => {
    localStorage.setItem('budgets', JSON.stringify(budgets));
  }, [budgets]);

  const addTransaction = (transaction) => {
    setTransactions([...transactions, { ...transaction, id: Date.now() }]);
  };

  const updateTransaction = (updatedTransaction) => {
    setTransactions(transactions.map(transaction => 
      transaction.id === updatedTransaction.id ? updatedTransaction : transaction
    ));
    setEditingTransaction(null);
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(transaction => transaction.id !== id));
  };

  const startEditing = (transaction) => {
    setEditingTransaction(transaction);
  };
  
  const saveBudgets = (newBudgets) => {
    setBudgets(newBudgets);
  };

  const getMonthlyData = () => {
    const monthlyData = {};
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = 0;
      }
      
      monthlyData[monthYear] += parseFloat(transaction.amount);
    });
    
    return Object.keys(monthlyData).map(month => ({
      month,
      amount: monthlyData[month]
    })).sort((a, b) => {
      const [aMonth, aYear] = a.month.split('/');
      const [bMonth, bYear] = b.month.split('/');
      
      if (aYear !== bYear) return aYear - bYear;
      return aMonth - bMonth;
    });
  };

  const getCategoryData = () => {
    const categoryData = {};
    
    // Initialize all categories with 0
    CATEGORIES.forEach(category => {
      categoryData[category.value] = 0;
    });
    
    // Sum up transaction amounts by category
    transactions.forEach(transaction => {
      if (transaction.category) {
        categoryData[transaction.category] = (categoryData[transaction.category] || 0) + parseFloat(transaction.amount);
      }
    });
    
    // Convert to array format for charts
    return Object.keys(categoryData)
      .filter(category => categoryData[category] > 0) // Only include categories with transactions
      .map(category => ({
        name: CATEGORIES.find(c => c.value === category)?.label || category,
        value: categoryData[category],
        color: CATEGORY_COLORS[category] || '#CBD5E0'
      }));
  };

  const getRecentTransactions = (count = 5) => {
    return [...transactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, count);
  };

  const getTotalExpenses = () => {
    return transactions.reduce((total, transaction) => total + parseFloat(transaction.amount), 0);
  };

  const getCurrentMonthTransactions = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    });
  };
  
  const getCurrentMonthExpenses = () => {
    return getCurrentMonthTransactions().reduce(
      (total, transaction) => total + parseFloat(transaction.amount), 
      0
    );
  };
  
  const getBudgetVsActualData = () => {
    const categoryData = {};
    
    // Initialize with zeros
    CATEGORIES.forEach(category => {
      categoryData[category.value] = 0;
    });
    
    // Sum current month transactions
    getCurrentMonthTransactions().forEach(transaction => {
      if (transaction.category) {
        categoryData[transaction.category] = (categoryData[transaction.category] || 0) + parseFloat(transaction.amount);
      }
    });
    
    // Convert to the format needed for comparison chart
    return Object.keys(categoryData).map(category => ({
      category: CATEGORIES.find(c => c.value === category)?.label || category,
      actual: categoryData[category],
      budget: budgets[category] || 0,
      difference: (budgets[category] || 0) - categoryData[category]
    }));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <DashboardCards 
                totalExpenses={getTotalExpenses()} 
                categoryData={getCategoryData()} 
                recentTransactions={getRecentTransactions()} 
                budgets={budgets}
                currentMonthExpenses={getCurrentMonthExpenses()}
              />
            </div>
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Monthly Expenses</h2>
                <div className="h-64">
                  {getMonthlyData().length > 0 ? (
                    <BarChart 
                      width={500} 
                      height={300} 
                      data={getMonthlyData()}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="amount" fill="#4F46E5" name="Expenses" />
                    </BarChart>
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-500">
                      No data available. Add transactions to see your monthly expenses.
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Expenses by Category</h2>
                <CategoryPieChart data={getCategoryData()} />
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Spending Insights</h2>
                <SpendingInsights 
                  budgets={budgets} 
                  categoryData={getCategoryData()} 
                />
              </div>
            </div>
          </div>
        );
      case 'transactions':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">
                {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
              </h2>
              <TransactionForm 
                onSubmit={editingTransaction ? updateTransaction : addTransaction}
                initialValues={editingTransaction}
                buttonText={editingTransaction ? 'Update Transaction' : 'Add Transaction'}
              />
              {editingTransaction && (
                <button 
                  className="mt-4 w-full bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400"
                  onClick={() => setEditingTransaction(null)}
                >
                  Cancel
                </button>
              )}
            </div>
            
            <div className="lg:col-span-2">
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
                <TransactionList 
                  transactions={transactions}
                  onDelete={deleteTransaction}
                  onEdit={startEditing}
                />
              </div>
            </div>
          </div>
        );
      case 'budgets':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow">
                <BudgetForm 
                  budgets={budgets} 
                  onSaveBudgets={saveBudgets} 
                />
              </div>
            </div>
            
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Budget vs. Actual</h2>
                <BudgetComparison 
                  budgets={budgets}
                  categoryData={getCategoryData()}
                />
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Spending Insights</h2>
                <SpendingInsights 
                  budgets={budgets} 
                  categoryData={getCategoryData()} 
                />
              </div>
            </div>
          </div>
        );
      case 'reports':
        return (
          <div className="grid grid-cols-1 gap-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Budget Overview</h2>
              <BudgetComparison 
                budgets={budgets}
                categoryData={getCategoryData()}
              />
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Monthly Trend</h2>
              <div className="h-64">
                {getMonthlyData().length > 0 ? (
                  <LineChart
                    width={500}
                    height={300}
                    data={getMonthlyData()}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="amount" 
                      stroke="#4F46E5" 
                      name="Monthly Expenses" 
                      strokeWidth={2} 
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-500">
                    No data available. Add transactions to see monthly trends.
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Personal Finance Tracker</h1>
        
        {renderContent()}
      </main>
      
      <Footer />
    </div>
  );
}

export default App;