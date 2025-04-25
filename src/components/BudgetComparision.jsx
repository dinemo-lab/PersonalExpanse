import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { CATEGORIES, CATEGORY_COLORS } from '../constants';

function BudgetComparison({ budgets, categoryData }) {
  // Prepare data for the comparison chart
  const prepareComparisonData = () => {
    // Get all categories that have either a budget or actual expense
    const allCategories = [...new Set([
      ...Object.keys(budgets || {}),
      ...categoryData.map(item => CATEGORIES.find(c => c.label === item.name)?.value).filter(Boolean)
    ])];
    
    return allCategories.map(categoryKey => {
      const categoryObj = CATEGORIES.find(c => c.value === categoryKey);
      const categoryLabel = categoryObj ? categoryObj.label : categoryKey;
      const categoryExpense = categoryData.find(item => item.name === categoryLabel)?.value || 0;
      const categoryBudget = budgets[categoryKey] || 0;
      
      return {
        name: categoryLabel,
        budget: categoryBudget,
        actual: categoryExpense,
        status: categoryExpense > categoryBudget ? 'overbudget' : 'underbudget',
        categoryKey
      };
    }).filter(item => item.budget > 0 || item.actual > 0); // Only include categories with either budget or expense
  };
  
  const data = prepareComparisonData();
  
  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        No budget or expense data available. Set budgets and add transactions to see the comparison.
      </div>
    );
  }
  
  return (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
          barGap={0}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            angle={-45} 
            textAnchor="end" 
            tick={{ fontSize: 12 }}
            height={70}
          />
          <YAxis />
          <Tooltip 
            formatter={(value) => `$${value.toFixed(2)}`}
            labelFormatter={(value) => `Category: ${value}`}
          />
          <Legend />
          <Bar dataKey="budget" name="Budget" fill="#8884d8" barSize={20} />
          <Bar dataKey="actual" name="Actual" barSize={20}>
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.status === 'overbudget' ? '#FF5252' : '#4CAF50'} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BudgetComparison;
