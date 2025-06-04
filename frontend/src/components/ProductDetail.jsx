import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService, reviewService } from '../services/api';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingReview, setEditingReview] = useState(null);
  const [newReview, setNewReview] = useState({
    author: '',
    rating: 5,
    comment: '',
  });

  useEffect(() => {
    carregarDados();
  }, [id]);

  const carregarDados = async () => {
    try {
      setLoading(true);
      setError(null);
      const [productResponse, reviewsResponse, ratingResponse] = await Promise.all([
        productService.getProduct(id),
        reviewService.getProductReviews(id),
        productService.getProductAverageRating(id),
      ]);
      setProduct(productResponse.data);
      setReviews(reviewsResponse.data.reviews || []);
      setAverageRating(ratingResponse.data.averageRating);
    } catch (err) {
      setError('Não foi possível carregar os dados do produto.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await productService.deleteProduct(id);
        navigate('/');
      } catch (err) {
        setError('Não foi possível excluir o produto.');
      }
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingReview) {
        // Atualizar av existente
        const response = await reviewService.updateReview(editingReview._id, {
          author: newReview.author,
          rating: newReview.rating,
          comment: newReview.comment,
          productId: id,
        });

        // Atualiza a av na lista
        setReviews(reviews.map(review =>
          review._id === editingReview._id ? response.data : review
        ));

        setEditingReview(null);
        setNewReview({ author: '', rating: 5, comment: '' });

        const ratingRes = await productService.getProductAverageRating(id);
        setAverageRating(ratingRes.data.averageRating || 0);
      } else {
        // Criar nova av
        const response = await reviewService.createReview({
          author: newReview.author,
          rating: newReview.rating,
          comment: newReview.comment,
          productId: id,
        });
        setReviews([...reviews, response.data]);
        setNewReview({ author: '', rating: 5, comment: '' });

        // média das av
        const ratingRes = await productService.getProductAverageRating(id);
        setAverageRating(ratingRes.data.averageRating || 0);
      }
    } catch (err) {
      setError('Não foi possível enviar sua avaliação.');
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setNewReview({
      author: review.author,
      rating: review.rating,
      comment: review.comment,
    });
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
    setNewReview({ author: '', rating: 5, comment: '' });
  };

  const handleReviewDelete = async (reviewId) => {
    if (window.confirm('Tem certeza que deseja excluir esta avaliação?')) {
      try {
        await reviewService.deleteReview(reviewId);
        setReviews(reviews.filter(review => review._id !== reviewId));

        // média das av
        const ratingRes = await productService.getProductAverageRating(id);
        setAverageRating(ratingRes.data.averageRating || 0);
      } catch (err) {
        setError('Não foi possível excluir a avaliação.');
      }
    }
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
            onClick={() => carregarDados()}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors duration-200"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600">Produto não encontrado.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
          >
            Voltar para Lista
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
              <p className="text-gray-600 mt-2">{product.description}</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => navigate(`/products/edit/${id}`)}
                className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
              >
                Editar
              </button>
              <button
                onClick={handleDelete}
                className="text-red-600 hover:text-red-800 transition-colors duration-200"
              >
                Excluir
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Detalhes do Produto
              </h2>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Preço</dt>
                  <dd className="text-lg font-semibold text-indigo-600">
                    R$ {product.price.toFixed(2)}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Categoria</dt>
                  <dd className="text-gray-900">{product.category}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Avaliação Média
                  </dt>
                  <dd className="flex items-center">
                    <span className="text-lg font-semibold text-gray-900">
                      {averageRating.toFixed(1)}
                    </span>
                    <span className="ml-2 text-yellow-400">★</span>
                  </dd>
                </div>
              </dl>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {editingReview ? 'Editar Avaliação' : 'Deixe sua Avaliação'}
              </h2>
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Autor
                  </label>
                  <input
                    type="text"
                    value={newReview.author}
                    onChange={(e) =>
                      setNewReview({ ...newReview, author: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                    placeholder="Seu nome"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nota
                  </label>
                  <select
                    value={newReview.rating}
                    onChange={(e) =>
                      setNewReview({ ...newReview, rating: Number(e.target.value) })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <option key={rating} value={rating}>
                        {rating} {rating === 1 ? 'estrela' : 'estrelas'}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Comentário
                  </label>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) =>
                      setNewReview({ ...newReview, comment: e.target.value })
                    }
                    rows="3"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                    placeholder="Digite seu comentário sobre o produto"
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200"
                  >
                    {editingReview ? 'Atualizar Avaliação' : 'Enviar Avaliação'}
                  </button>
                  {editingReview && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors duration-200"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Avaliações ({reviews.length})
            </h2>
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-gray-50 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-yellow-400 mr-2">★</span>
                          <span className="font-medium">{review.rating}</span>
                        </div>
                        <span className="text-sm text-gray-500">Por: {review.author}</span>
                      </div>
                      <p className="mt-2 text-gray-600">{review.comment}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditReview(review)}
                        className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleReviewDelete(review._id)}
                        className="text-red-600 hover:text-red-800 transition-colors duration-200"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 