import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import { getBooks } from '../services/bookService';
import { addToCart } from '../store/cartSlice';

const BrowseBooks = () => {
  const dispatch = useDispatch();
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedSort, setSelectedSort] = useState('featured');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const userState = useSelector((state) => state.user);
  const isAuthenticated = userState?.isAuthenticated || false;

  // Fetch books from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Create filters object for the API
        const filters = {
          genre: selectedGenre !== 'all' ? selectedGenre : null,
          searchQuery: searchQuery || null,
          sort: selectedSort
        };
        
        // Fetch books with filters
        const fetchedBooks = await getBooks(filters);
        
        if (fetchedBooks) {
          setBooks(fetchedBooks);
          setFilteredBooks(fetchedBooks);
        } else {
          setBooks([]);
          setFilteredBooks([]);
        }
      } catch (err) {
        setError('Failed to load books. Please try again later.');
        console.error('Error fetching books:', err);
        toast.error('Failed to load books');
      } finally {
      setLoading(false);
      }
    };
    
    fetchData();
  }, [selectedSort, selectedGenre, searchQuery]);

  // Filter books based on search, genre, and sort
  useEffect(() => {
    // Start with a copy of all books
    let result = [...books];

    // Filter by search query
    if (searchQuery) {
      result = result.filter(book => 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by genre
    if (selectedGenre !== 'all') {
      result = result.filter(book => book.genre === selectedGenre);
    }
    
    // Sort books
    switch (selectedSort) {
      case 'featured':
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // 'featured' sort - no change to default order
        break;
    }
    
    setFilteredBooks(result);
  }, [searchQuery, selectedGenre, selectedSort, books]);

  const handleAddToCart = async (book) => {
    if (!isAuthenticated) {
      toast.info('Please log in to add items to your cart');
      return;
    }
    
    try {
      // In a real implementation, we would call the cartService here
      // For this example, we'll use the Redux action
      dispatch(addToCart(book));
      
      // Show success message
      toast.success(`${book.title} added to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add book to cart');
    }
  };

  const genres = [
    { id: 'all', name: 'All Genres' },
    { id: 'fiction', name: 'Fiction' },
    { id: 'non-fiction', name: 'Non-Fiction' },
    { id: 'mystery', name: 'Mystery & Thriller' },
    { id: 'scifi', name: 'Sci-Fi & Fantasy' },
    { id: 'biography', name: 'Biography' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Browse Books</h1>
        <Link to="/" className="text-primary flex items-center text-sm">
          <span className="mr-1">Back to Home</span>
          {(() => {
            const HomeIcon = getIcon('home');
            return <HomeIcon className="w-4 h-4" />;
          })()}
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-surface-800 p-4 rounded-lg shadow-sm border border-surface-200 dark:border-surface-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {(() => {
                const SearchIcon = getIcon('search');
                return <SearchIcon className="w-5 h-5 text-surface-400" />;
              })()}
            </div>
            <input
              type="text"
              className="input pl-10"
              placeholder="Search by title or author"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <select
            className="input"
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
          >
            {genres.map(genre => (
              <option key={genre.id} value={genre.id}>{genre.name}</option>
            ))}
          </select>
          
          <select
            className="input"
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value)}
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>
      
      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4 mb-4">
          <div className="flex">
            <div className="py-1">{getIcon('alert-circle') && getIcon('alert-circle')()}</div>
            <div className="ml-2">{error}</div>
          </div>
        </div>
      )}

      {/* Book Results */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-r-transparent mb-4"></div>
          <p className="text-surface-600 dark:text-surface-400">Loading books...</p>
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="py-20 text-center">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold mb-2">No books found</h3>
          <p className="text-surface-600 dark:text-surface-400 mb-4">Try adjusting your search or filters</p>
          <button 
            className="btn-primary"
            onClick={() => {
              setSearchQuery('');
              setSelectedGenre('all');
              setSelectedSort('featured');
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <motion.div
              key={book.id}
              className="card card-hover"
            >
              <Link to={`/book/${book.id}`} className="cursor-pointer">
                <motion.div className="relative h-64 overflow-hidden rounded-t-xl"
                  whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }}
                >
                  <img 
                    src={book.cover} 
                    alt={book.title} 
                    className="w-full h-full object-cover"
                  />
                <div className="absolute top-2 right-2">
                  <span className="bg-accent text-white text-xs font-bold px-2 py-1 rounded">
                    ${book.price.toFixed(2)}
                  </span>
                </div>
                </motion.div>
              </Link>
              <div className="p-4" onClick={(e) => e.stopPropagation()}>
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
                <Link to={`/book/${book.id}`}>
                  <h3 className="font-bold text-lg mb-1 hover:text-primary transition-colors">{book.title}</h3>
                </Link>
                <Link to={`/book/${book.id}`}>
                  <p className="text-surface-600 dark:text-surface-400 text-sm mb-2">by {book.author}</p>
                </Link>
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
      )}
    </div>
  );
};

export default BrowseBooks;