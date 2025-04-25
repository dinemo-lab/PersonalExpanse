import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { CATEGORIES } from '../constants';
import { Progress } from './ui/progress';

function DashboardCards({ totalExpenses, categoryData, recentTransactions, budgets, currentMonthExpenses }) {
  const getTopCategories = () => {
    return [...categoryData]
      .sort((a, b) => b.value - a.value)
      .slice(0, 3);
  };
  
  const getCategoryLabel = (categoryValue) => {
    const category = CATEGORIES.find(c => c.value === categoryValue);
    return category ? category.label : categoryValue;
  };
  
  const totalBudget = Object.values(budgets || {}).reduce((sum, amount) => sum + (amount || 0), 0);
  
  const getBudgetProgress = () => {
    if (!totalBudget) return 0;
    return Math.min(Math.round((currentMonthExpenses / totalBudget) * 100), 100);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Total Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalExpenses.toFixed(2)}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Monthly Budget</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalBudget.toFixed(2)}</div>
          <div className="mt-2 text-sm text-gray-600">This Month: ${currentMonthExpenses.toFixed(2)}</div>
          <div className="mt-2">
            <Progress value={getBudgetProgress()} className="h-2" />
            <div className="mt-1 flex justify-between text-xs text-gray-500">
              <span>0%</span>
              <span>
                {getBudgetProgress()}% 
                {getBudgetProgress() >= 100 ? ' (Over budget!)' : ''}
              </span>
              <span>100%</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Top Categories</CardTitle>
        </CardHeader>
        <CardContent>
          {getTopCategories().length > 0 ? (
            <ul className="space-y-2">
              {getTopCategories().map((category, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span className="text-gray-700">{category.name}</span>
                  <span className="font-medium">${category.value.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No category data available</p>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {recentTransactions.length > 0 ? (
            <ul className="divide-y">
              {recentTransactions.map(transaction => (
                <li key={transaction.id} className="py-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{transaction.description}</span>
                    <span className="text-gray-700">${transaction.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>{new Date(transaction.date).toLocaleDateString()}</span>
                    <span>
                      {transaction.category ? getCategoryLabel(transaction.category) : '—'}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No recent transactions</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default DashboardCards;
