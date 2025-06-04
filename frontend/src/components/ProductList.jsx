import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../services/api';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    carregarProdutos();
  }, [retryCount]);

  const carregarProdutos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productService.getAllProducts();
      setProducts(response.data.products || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Não foi possível carregar os produtos. Por favor, tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await productService.deleteProduct(id);
        setProducts(products.filter(product => product._id !== id));
      } catch (err) {
        setError('Não foi possível excluir o produto. Por favor, tente novamente.');
      }
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors duration-200"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600 mb-4">Nenhum produto cadastrado.</p>
          <Link
            to="/products/new"
            className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200"
          >
            Cadastrar Primeiro Produto
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {product.name}
              </h3>
              <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-indigo-600 font-bold">
                  R$ {product.price.toFixed(2)}
                </span>
                <span className="text-sm text-gray-500">{product.category}</span>
              </div>
              <div className="mt-4 flex justify-between">
                <Link
                  to={`/products/${product._id}`}
                  className="text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
                >
                  Ver Detalhes
                </Link>
                <div className="space-x-2">
                  <Link
                    to={`/products/edit/${product._id}`}
                    className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="text-red-600 hover:text-red-800 transition-colors duration-200"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList; 