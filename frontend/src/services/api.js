import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, 
  withCredentials: true, 
  validateStatus: function (status) {
    return status >= 200 && status < 500; 
  },
});


const tentarNovamente = async (erro) => {
  const config = erro.config;
  
  if (!config || !config.retry || config.retryCount >= 3) {
    return Promise.reject(erro);
  }

  config.retryCount = config.retryCount || 0;
  config.retryCount += 1;

  const delay = Math.pow(2, config.retryCount) * 1000;
  await new Promise(resolve => setTimeout(resolve, delay));

  return api(config);
};

api.interceptors.response.use(
  (response) => response,
  async (erro) => {
    if (erro.code === 'ECONNABORTED' || erro.message === 'Network Error') {
      return tentarNovamente(erro);
    }
    
    console.error('Erro na API:', {
      mensagem: erro.message,
      status: erro.response?.status,
      dados: erro.response?.data,
      config: {
        url: erro.config?.url,
        metodo: erro.config?.method,
        headers: erro.config?.headers,
      }
    });
    
    if (erro.response?.status === 500) {
      return tentarNovamente(erro);
    }
    
    return Promise.reject(erro);
  }
);

api.interceptors.request.use(
  (config) => {
    config.retry = true;
    config.retryCount = 0;
    return config;
  },
  (erro) => {
    return Promise.reject(erro);
  }
);

export const productService = {
  getAllProducts: () => api.get('/products'),
  getProduct: (id) => api.get(`/products/${id}`),
  createProduct: (product) => api.post('/products', product),
  updateProduct: (id, product) => api.put(`/products/${id}`, product),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  getProductAverageRating: (id) => api.get(`/products/${id}/average-rating`),
};

export const reviewService = {
  getAllReviews: () => api.get('/reviews'),
  getProductReviews: (productId) => api.get(`/reviews/product/${productId}`),
  createReview: (review) => api.post('/reviews', review),
  updateReview: (id, review) => api.put(`/reviews/${id}`, review),
  deleteReview: (id) => api.delete(`/reviews/${id}`),
};

export default api; 