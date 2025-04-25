import { useState, useEffect } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { CATEGORIES, DEFAULT_BUDGETS } from '../constants';

function BudgetForm({ budgets, onSaveBudgets }) {
  const [budgetData, setBudgetData] = useState({});
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    setBudgetData(budgets || {});
  }, [budgets]);
  
  const handleChange = (category, value) => {
    setBudgetData(prev => ({
      ...prev,
      [category]: value
    }));
    
    // Clear error when field is edited
    if (errors[category]) {
      setErrors(prev => ({ ...prev, [category]: undefined }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    Object.keys(budgetData).forEach(category => {
      const value = budgetData[category];
      if (value && (isNaN(value) || parseFloat(value) < 0)) {
        newErrors[category] = 'Budget must be a positive number';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Convert all values to numbers and save
      const processedBudgets = {};
      Object.keys(budgetData).forEach(key => {
        processedBudgets[key] = budgetData[key] ? parseFloat(budgetData[key]) : 0;
      });
      
      onSaveBudgets(processedBudgets);
    }
  };
  
  const resetToDefaults = () => {
    setBudgetData(DEFAULT_BUDGETS);
  };
  
  return (
    <Card className="w-full border-none shadow-md">
      <CardHeader className="pb-3 pt-4">
        <CardTitle className="text-xl font-semibold text-gray-800">
          Monthly Budget Settings
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-5 pt-0 px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CATEGORIES.map(category => (
              <div key={category.value} className="space-y-1.5">
                <Label htmlFor={`budget-${category.value}`} className="text-gray-700 font-medium block">
                  {category.label}
                </Label>
                <Input
                  type="number"
                  id={`budget-${category.value}`}
                  value={budgetData[category.value] || ''}
                  onChange={(e) => handleChange(category.value, e.target.value)}
                  placeholder={`Budget for ${category.label}`}
                  step="0.01"
                  min="0"
                  className={`border rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors[category.value] ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
                  }`}
                />
                {errors[category.value] && (
                  <Alert variant="destructive" className="py-1.5 mt-1 text-red-500 bg-red-50 border border-red-200 rounded text-sm">
                    <AlertDescription>{errors[category.value]}</AlertDescription>
                  </Alert>
                )}
              </div>
            ))}
          </div>
        </CardContent>
        
        <CardFooter className="px-6 pb-6 pt-2 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <Button 
            type="button" 
            onClick={resetToDefaults}
            className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 rounded transition-colors h-10"
          >
            Reset to Defaults
          </Button>
          <Button 
            type="submit" 
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded transition-colors h-10"
          >
            Save Budgets
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

export default BudgetForm;