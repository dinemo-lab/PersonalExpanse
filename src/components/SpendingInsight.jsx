import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { TrendingDown, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { CATEGORIES } from '../constants';

function SpendingInsights({ budgets, categoryData }) {
  const generateInsights = () => {
    const insights = [];
    
    // Total overspending or underspending
    const totalBudget = Object.values(budgets || {}).reduce((sum, amount) => sum + (amount || 0), 0);
    const totalExpense = categoryData.reduce((sum, category) => sum + category.value, 0);
    
    if (totalBudget > 0) {
      const difference = totalBudget - totalExpense;
      const percentageDiff = Math.abs(difference) / totalBudget * 100;
      
      if (difference >= 0) {
        insights.push({
          type: 'positive',
          title: 'Budget Surplus',
          description: `You're under budget by $${difference.toFixed(2)} (${percentageDiff.toFixed(1)}% of total budget)`,
          icon: TrendingDown
        });
      } else {
        insights.push({
          type: 'negative',
          title: 'Budget Deficit',
          description: `You're over budget by $${Math.abs(difference).toFixed(2)} (${percentageDiff.toFixed(1)}% of total budget)`,
          icon: TrendingUp
        });
      }
    }
    
    // Category-specific insights
    const categoryInsights = [];
    
    categoryData.forEach(category => {
      const categoryKey = Object.keys(budgets || {}).find(key => 
        CATEGORIES.find(c => c.value === key)?.label === category.name
      );
      
      if (categoryKey && budgets[categoryKey] > 0) {
        const budget = budgets[categoryKey];
        const actual = category.value;
        const difference = budget - actual;
        const percentageDiff = Math.abs(difference) / budget * 100;
        
        if (difference < 0 && percentageDiff > 20) {
          categoryInsights.push({
            type: 'warning',
            title: `${category.name} Overspending`,
            description: `You've spent ${percentageDiff.toFixed(1)}% more than your budget in ${category.name}`,
            icon: AlertCircle
          });
        } else if (difference > 0 && percentageDiff > 50) {
          categoryInsights.push({
            type: 'info',
            title: `${category.name} Underspending`,
            description: `You've only used ${(100 - percentageDiff).toFixed(1)}% of your ${category.name} budget`,
            icon: CheckCircle
          });
        }
      }
    });
    
    // Sort insights by importance (warnings first)
    categoryInsights.sort((a, b) => {
      const typeOrder = { warning: 1, negative: 2, positive: 3, info: 4 };
      return typeOrder[a.type] - typeOrder[b.type];
    });
    
    // Return top 3 category insights plus overall insight
    return [...insights, ...categoryInsights.slice(0, 3)];
  };
  
  const insights = generateInsights();
  
  if (insights.length === 0) {
    return (
      <div className="text-gray-500 text-center py-4">
        Set budgets and add transactions to see spending insights.
      </div>
    );
  }
  
  const getAlertStyles = (type) => {
    switch (type) {
      case 'positive': 
        return {
          container: "bg-green-50 border-green-200",
          text: "text-green-800",
          icon: "text-green-500"
        };
      case 'negative': 
        return {
          container: "bg-red-50 border-red-200",
          text: "text-red-800",
          icon: "text-red-500"
        };
      case 'warning': 
        return {
          container: "bg-amber-50 border-amber-200",
          text: "text-amber-800",
          icon: "text-amber-500"
        };
      case 'info': 
        return {
          container: "bg-blue-50 border-blue-200",
          text: "text-blue-800",
          icon: "text-blue-500"
        };
      default: 
        return {
          container: "bg-gray-50 border-gray-200",
          text: "text-gray-800",
          icon: "text-gray-500"
        };
    }
  };
  
  return (
    <div className="space-y-4">
      {insights.map((insight, index) => {
        const styles = getAlertStyles(insight.type);
        const Icon = insight.icon;
        
        return (
          <div 
            key={index}
            className={`flex items-start p-4 border rounded-lg ${styles.container}`}
          >
            <Icon className={`h-5 w-5 mr-3 mt-1 flex-shrink-0 ${styles.icon}`} />
            <div>
              <h4 className={`font-medium text-sm mb-1 ${styles.text}`}>
                {insight.title}
              </h4>
              <p className={`text-sm ${styles.text}`}>
                {insight.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default SpendingInsights;