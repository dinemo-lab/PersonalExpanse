function Navbar({ activeTab, setActiveTab }) {
    const tabs = [
      { id: 'dashboard', label: 'Dashboard' },
      { id: 'transactions', label: 'Transactions' },
      { id: 'reports', label: 'Reports' }
    ];
    
    return (
      <nav className="bg-indigo-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-xl font-bold">Personal Finance Visualizer</div>
          <div className="hidden md:block">
            <ul className="flex space-x-6">
              {tabs.map(tab => (
                <li 
                  key={tab.id}
                  className={`cursor-pointer hover:text-indigo-200 transition-colors ${
                    activeTab === tab.id ? 'font-medium border-b-2 border-white' : ''
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    );
  }
  
  export default Navbar;