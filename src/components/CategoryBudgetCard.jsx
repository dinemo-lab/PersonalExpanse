import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { CATEGORIES, CATEGORY_COLORS } from '../constants';

function CategoryBudgetCard({ category, budget, spent }) {
  const percentageSpent = budget > 0 ? Math.min(Math.round((spent / budget) * 100), 100) : 0;
  const isOverBudget = spent > budget;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center text-base">
          <span>{category}</span>
          <span className={isOverBudget ? 'text-red-600' : ''}>
            ${spent.toFixed(2)} / ${budget.toFixed(2)}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Progress 
          value={percentageSpent} 
          className="h-2"
        />
        <div className="mt-1 flex justify-between text-xs text-gray-500">
          <span>0%</span>
          <span className={isOverBudget ? 'text-red-600 font-medium' : ''}>
            {percentageSpent}%
            {isOverBudget ? ' (Over!)' : ''}
          </span>
          <span>100%</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default CategoryBudgetCard;
