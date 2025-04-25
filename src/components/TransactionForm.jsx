import { useState, useEffect } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { format } from 'date-fns';
import { cn } from "../lib/utils";
import { CATEGORIES } from '../constants';

function TransactionForm({ onSubmit, initialValues, buttonText }) {
  const [formData, setFormData] = useState({
    amount: '',
    date: new Date(),
    description: '',
    category: ''
  });
  
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    if (initialValues) {
      setFormData({
        ...initialValues,
        date: initialValues.date ? new Date(initialValues.date) : new Date()
      });
    }
  }, [initialValues]);
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    if (!formData.description || !formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleDateSelect = (date) => {
    setFormData(prev => ({ ...prev, date }));
    if (errors.date) {
      setErrors(prev => ({ ...prev, date: undefined }));
    }
  };
  
  const handleCategoryChange = (value) => {
    setFormData(prev => ({ ...prev, category: value }));
    if (errors.category) {
      setErrors(prev => ({ ...prev, category: undefined }));
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        ...formData,
        amount: parseFloat(formData.amount),
        id: initialValues ? initialValues.id : undefined
      });
      
      // Reset form if not editing
      if (!initialValues) {
        setFormData({
          amount: '',
          date: new Date(),
          description: '',
          category: ''
        });
      }
    }
  };
  
  return (
    <Card className="w-full border-none shadow-md">
      <CardHeader className="pb-3 pt-4">
        <CardTitle className="text-xl font-semibold text-gray-800">
          {initialValues ? 'Edit Transaction' : 'Add Transaction'}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-5 pt-0 px-6">
          <div className="space-y-1.5">
            <Label htmlFor="amount" className="text-gray-700 font-medium mb-1 block">Amount</Label>
            <Input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Enter amount"
              step="0.01"
              className={cn(
                "border rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
                errors.amount && "border-red-500 focus:ring-red-500 focus:border-red-500"
              )}
            />
            {errors.amount && (
              <Alert variant="destructive" className="py-1.5 mt-1 text-red-500 bg-red-50 border border-red-200 rounded text-sm">
                <AlertDescription>{errors.amount}</AlertDescription>
              </Alert>
            )}
          </div>
          
          <div className="space-y-1.5">
            <Label htmlFor="date" className="text-gray-700 font-medium mb-1 block">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal border rounded h-10",
                    !formData.date && "text-gray-400",
                    errors.date && "border-red-500",
                    "hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date ? format(formData.date, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent 
                className="w-auto p-0 bg-white border border-gray-200 rounded-md shadow-lg z-50" 
                align="start"
                sideOffset={5}
              >
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={handleDateSelect}
                  initialFocus
                  className="bg-white"
                />
              </PopoverContent>
            </Popover>
            {errors.date && (
              <Alert variant="destructive" className="py-1.5 mt-1 text-red-500 bg-red-50 border border-red-200 rounded text-sm">
                <AlertDescription>{errors.date}</AlertDescription>
              </Alert>
            )}
          </div>
          
          <div className="space-y-1.5">
            <Label htmlFor="category" className="text-gray-700 font-medium mb-1 block">Category</Label>
            <Select 
              value={formData.category} 
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger 
                className={cn(
                  "w-full border rounded h-10 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
                  errors.category && "border-red-500 focus:ring-red-500 focus:border-red-500"
                )}
              >
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {CATEGORIES.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <Alert variant="destructive" className="py-1.5 mt-1 text-red-500 bg-red-50 border border-red-200 rounded text-sm">
                <AlertDescription>{errors.category}</AlertDescription>
              </Alert>
            )}
          </div>
          
          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-gray-700 font-medium mb-1 block">Description</Label>
            <Input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter description"
              className={cn(
                "border rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
                errors.description && "border-red-500 focus:ring-red-500 focus:border-red-500"
              )}
            />
            {errors.description && (
              <Alert variant="destructive" className="py-1.5 mt-1 text-red-500 bg-red-50 border border-red-200 rounded text-sm">
                <AlertDescription>{errors.description}</AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="px-6 pb-6 pt-2">
          <Button 
            type="submit" 
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded transition-colors h-10"
          >
            {buttonText || 'Add Transaction'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

export default TransactionForm;