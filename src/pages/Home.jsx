import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import MainFeature from '../components/MainFeature';
import { addToCart } from '../store/cartSlice';

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const dispatch = useDispatch();
  
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
  
  
  // Featured book data
  const featuredBooks = [
    {
      id: 1,
      title: "The Midnight Library",
      author: "Matt Haig",
      cover: "https://source.unsplash.com/FHQ2B9U9DCA/400x600",
      price: 16.99,
      rating: 4.5,
      condition: "New",
      description: "Between life and death there is a library. When Nora finds herself in the Midnight Library, she has a chance to make things right."
    },
    {
      id: 2,
      title: "Project Hail Mary",
      author: "Andy Weir",
      cover: "https://source.unsplash.com/cckf4TsHAuw/400x600",
      price: 19.99,
      rating: 4.8,
      condition: "New",
      description: "A lone astronaut must save the earth from disaster in this incredible new science-based thriller from the #1 New York Times bestselling author of The Martian."
    },
    {
      id: 3,
      title: "Think Again",
      author: "Adam Grant",
      cover: "https://source.unsplash.com/YLSwjSy7stw/400x600",
      price: 14.99,
      rating: 4.3,
      condition: "Like New",
      description: "The bestselling author of Give and Take and Originals examines the critical art of rethinking: learning to question your opinions and open other people's minds."
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary-dark/80 z-10"></div>
        <img 
          src="https://source.unsplash.com/lc7xcWebECc/1600x900" 
          alt="Books on a shelf" 
          className="w-full h-96 object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 md:px-12 lg:px-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Discover Your Next Favorite Book
            </h1>
            <p className="text-white/90 text-lg md:text-xl max-w-2xl mb-6">
              Browse thousands of books from independent sellers and bookstores around the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/browse" className="btn bg-white text-primary hover:bg-surface-100 focus:ring-white text-center">
                Browse Books
              </Link>
              <Link to="/sell" className="btn border-2 border-white text-white hover:bg-white/10 focus:ring-white text-center">
                Sell Your Books
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="overflow-x-auto scrollbar-hide">
        <div className="flex space-x-2 min-w-max pb-2">
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
          <h2 className="text-2xl font-bold">Featured Books</h2>
          <a href="#" className="text-primary dark:text-primary-light font-medium flex items-center">
            View all
            {(() => {
              const ArrowRightIcon = getIcon('arrow-right');
              return <ArrowRightIcon className="w-4 h-4 ml-1" />;
            })()}
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredBooks.map((book) => (
            <motion.div
              key={book.id}
              className="card card-hover"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="relative h-64 overflow-hidden rounded-t-xl">
                <img 
                  src={book.cover} alt={book.title} className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <span className="bg-accent text-white text-xs font-bold px-2 py-1 rounded">
                    ${book.price}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center mb-1">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => {
                      const StarIcon = getIcon(i < Math.floor(book.rating) ? 'star' : 'star-outline');
                      return (
                        <StarIcon 
                          key={i} 
                          className={`w-4 h-4 ${i < Math.floor(book.rating) ? 'text-amber-400' : 'text-surface-300'}`} 
                        />
                      );
                    })}
                  </div>
                  <span className="text-xs text-surface-500 ml-1">({book.rating})</span>
                </div>
                <h3 className="font-bold text-lg mb-1 dark:text-surface-100">{book.title}</h3>
                <p className="text-surface-600 dark:text-surface-400 text-sm mb-2">by {book.author}</p>
                <p className="text-surface-500 dark:text-surface-400 text-sm mb-3 line-clamp-2">{book.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium px-2 py-1 bg-surface-100 dark:bg-surface-700 rounded-full">
                    {book.condition}
                  </span>
                  <button
                    className="btn-accent text-sm py-1.5"
                    onClick={() => handleAddToCart(book)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

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
            description: 'Not satisfied? Return within 30 days for a full refund.'
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