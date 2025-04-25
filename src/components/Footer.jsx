function Footer() {
    return (
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p>Personal Finance Visualizer &copy; {new Date().getFullYear()}</p>
          <p className="text-gray-400 text-sm mt-2">Track your finances with ease</p>
        </div>
      </footer>
    );
  }
  
  export default Footer;
  