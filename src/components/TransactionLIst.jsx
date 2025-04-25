import { Badge } from './ui/badge';
import { CATEGORIES } from '../constants';

function TransactionList({ transactions, onDelete, onEdit }) {
  if (transactions.length === 0) {
    return (
      <div className="text-gray-500 text-center py-4">
        No transactions found. Add your first transaction to get started.
      </div>
    );
  }
  
  const getCategoryLabel = (categoryValue) => {
    const category = CATEGORIES.find(c => c.value === categoryValue);
    return category ? category.label : categoryValue;
  };
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left">Date</th>
            <th className="px-4 py-2 text-left">Description</th>
            <th className="px-4 py-2 text-left">Category</th>
            <th className="px-4 py-2 text-right">Amount</th>
            <th className="px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(transaction => (
            <tr key={transaction.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">
                {new Date(transaction.date).toLocaleDateString()}
              </td>
              <td className="px-4 py-2">{transaction.description}</td>
              <td className="px-4 py-2">
                {transaction.category ? (
                  <Badge variant="outline" className="bg-gray-100">
                    {getCategoryLabel(transaction.category)}
                  </Badge>
                ) : '—'}
              </td>
              <td className="px-4 py-2 text-right font-medium">
                ${transaction.amount.toFixed(2)}
              </td>
              <td className="px-4 py-2 text-center">
                <button 
                  onClick={() => onEdit(transaction)}
                  className="text-blue-600 hover:text-blue-800 mr-2"
                >
                  Edit
                </button>
                <button 
                  onClick={() => onDelete(transaction.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          
        </tbody>
      </table>
    </div>
  );
}

export default TransactionList;

