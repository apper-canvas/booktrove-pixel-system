import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import MainFeature from '../components/MainFeature';
import { addToCart } from '../store/cartSlice';
import { getBooks } from '../services/bookService';

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.user);
  const isAuthenticated = userState?.isAuthenticated || false;
  
  // Fetch featured books
  useEffect(() => {
    const fetchFeaturedBooks = async () => {
      setLoading(true);
      setError(null);
      try {
        const books = await getBooks({ sort: 'rating' }, 1, 3);
        if (books) {
          setFeaturedBooks(books);
        }
      } catch (err) {
        setError('Failed to load featured books');
        console.error('Error fetching featured books:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedBooks();
  }, []);
  
  const categories = [
    { id: 'all', name: 'All Books' },
    { id: 'fiction', name: 'Fiction' },
    { id: 'non-fiction', name: 'Non-Fiction' },
    { id: 'mystery', name: 'Mystery & Thriller' },
    { id: 'scifi', name: 'Sci-Fi & Fantasy' },
    { id: 'biography', name: 'Biography' }
  ];
  
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };
  
  const handleAddToCart = (book) => {
    dispatch(addToCart(book));
    toast.success(`${book.title} added to cart!`);
  };
  
  

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative rounded-2xl overflow-hidden">
        <div className="flex gap-2 overflow-x-auto py-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category.id
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-surface-700 dark:text-surface-300 hover:border-primary dark:hover:border-primary-light'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </section>

      {/* Main Feature Component */}
      <MainFeature />

      {/* Featured Books Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold dark:text-surface-100">Featured Books</h2>
          <a href="#" className="text-primary dark:text-primary-light font-medium flex items-center">
            View all
            {(() => {
              const ArrowRightIcon = getIcon('arrow-right');
              return <ArrowRightIcon className="w-4 h-4 ml-1" />;
            })()}
          </a>
        </div>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-r-transparent"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
            <p>{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredBooks.map((book) => (
              <motion.div
                key={book.id || book.Id}
                className="card card-hover"
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="relative h-64 overflow-hidden rounded-t-xl">
                  <img 
                    src={book.cover} 
                    alt={book.title || book.Name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <span className="bg-accent text-white text-xs font-bold px-2 py-1 rounded">
                      ${parseFloat(book.price).toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center mb-1">
                    <div className="flex">
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Benefits Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 py-10">
        {[
          {
            icon: 'truck',
            title: 'Fast Shipping',
            description: 'Books delivered to your doorstep with care and speed.'
          },
          {
            icon: 'shield-check',
            title: 'Secure Payments',
            description: 'Your payments and personal information are always protected.'
          },
          {
            icon: 'rotate-ccw',
            title: 'Easy Returns',
            description: 'Not what you expected? Return it within 30 days for a full refund.'
          }
        ].map((benefit, index) => (
          <div key={index} className="card p-6 text-center">
            <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mx-auto mb-4">
              {(() => {
                const Icon = getIcon(benefit.icon);
                return <Icon className="w-8 h-8 text-primary" />;
              })()}
            </div>
            <h3 className="text-xl font-bold mb-2 dark:text-surface-100">{benefit.title}</h3>
            <p className="text-surface-600 dark:text-surface-200">{benefit.description}</p>
          </div>
        ))}
      </section>
    </div>
  );
};
export default Home;