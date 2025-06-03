import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-indigo-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-white text-xl font-bold hover:text-indigo-100 transition-colors duration-200">
              DFcom Sistemas
            </Link>
          </div>
          <div className="flex space-x-4">
            <Link
              to="/"
              className="text-white hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Lista de Produtos
            </Link>
            <Link
              to="/products/new"
              className="bg-white text-indigo-600 hover:bg-indigo-50 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Cadastrar Produto
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 