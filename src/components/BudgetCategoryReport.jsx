import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { CATEGORIES, CATEGORY_COLORS } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import CategoryBudgetCard from './CategoryBudgetCard';

function BudgetCategoryReport({ transactions, budgets }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const getMonthlyDataForCategory = (categoryKey) => {
    const monthlyData = {};
    
    const filteredTransactions = categoryKey === 'all' 
      ? transactions 
      : transactions.filter(t => t.category === categoryKey);
    
    filteredTransactions.forEach(transaction => {
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
  
  const getCategorySpending = () => {
    const categorySpending = {};
    
    // Initialize all categories with 0
    CATEGORIES.forEach(category => {
      categorySpending[category.value] = 0;
    });
    
    // Sum up current month transactions by category
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    transactions.forEach(transaction => {
      const transactionDate = new Date(transaction.date);
      if (transactionDate.getMonth() === currentMonth && 
          transactionDate.getFullYear() === currentYear &&
          transaction.category) {
        categorySpending[transaction.category] = 
          (categorySpending[transaction.category] || 0) + parseFloat(transaction.amount);
      }
    });
    
    return categorySpending;
  };
  
  const chartData = getMonthlyDataForCategory(selectedCategory);
  const categorySpending = getCategorySpending();
  
  const selectedCategoryLabel = selectedCategory === 'all' 
    ? 'All Categories' 
    : CATEGORIES.find(c => c.value === selectedCategory)?.label || selectedCategory;
  
  const chartColor = selectedCategory === 'all' 
    ? '#4F46E5' 
    : CATEGORY_COLORS[selectedCategory] || '#CBD5E0';
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-xl font-semibold">Budget Category Analysis</h2>
        <Select 
          value={selectedCategory} 
          onValueChange={setSelectedCategory}
        >
          <SelectTrigger className="w-full md:w-64">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Monthly Spending - {selectedCategoryLabel}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                  <Legend />
                  <Bar 
                    dataKey="amount" 
                    name={`${selectedCategoryLabel} Expenses`}
                    fill={chartColor}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-gray-500">
                No data available for this category. Add transactions to see spending details.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {selectedCategory === 'all' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATEGORIES.filter(category => budgets[category.value] > 0 || categorySpending[category.value] > 0)
            .map((category) => (
              <CategoryBudgetCard
                key={category.value}
                category={category.label}
                budget={budgets[category.value] || 0}
                spent={categorySpending[category.value] || 0}
              />
            ))}
        </div>
      )}
    </div>
  );
}

export default BudgetCategoryReport;
