import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import { addToCart } from '../store/cartSlice';

const BrowseBooks = () => {
  const dispatch = useDispatch();
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedSort, setSelectedSort] = useState('featured');
  const [loading, setLoading] = useState(true);

  // Mock book data - in a real app this would come from an API
  useEffect(() => {
    // Simulate API loading delay
    setTimeout(() => {
      const mockBooks = [
        {
          id: 1,
          title: "The Midnight Library",
          author: "Matt Haig",
          cover: "https://source.unsplash.com/FHQ2B9U9DCA/400x600",
          price: 16.99,
          rating: 4.5,
          genre: "fiction",
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
          genre: "scifi",
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
          genre: "non-fiction",
          condition: "Like New",
          description: "The bestselling author of Give and Take and Originals examines the critical art of rethinking: learning to question your opinions and open other people's minds."
        },
        {
          id: 4,
          title: "The Silent Patient",
          author: "Alex Michaelides",
          cover: "https://source.unsplash.com/LJ9KY8pIH3E/400x600",
          price: 13.99,
          rating: 4.6,
          genre: "mystery",
          condition: "New",
          description: "The Silent Patient is a shocking psychological thriller of a woman's act of violence against her husband—and of the therapist obsessed with uncovering her motive."
        },
        {
          id: 5,
          title: "Becoming",
          author: "Michelle Obama",
          cover: "https://source.unsplash.com/zSG-kd-L6vw/400x600",
          price: 21.99,
          rating: 4.9,
          genre: "biography",
          condition: "Good",
          description: "In her memoir, a work of deep reflection and mesmerizing storytelling, Michelle Obama invites readers into her world, chronicling the experiences that have shaped her."
        },
        {
          id: 6,
          title: "The Lord of the Rings",
          author: "J.R.R. Tolkien",
          cover: "https://source.unsplash.com/R6m-crB1Ci4/400x600",
          price: 28.99,
          rating: 4.9,
          genre: "scifi",
          condition: "New",
          description: "One Ring to rule them all, One Ring to find them, One Ring to bring them all and in the darkness bind them."
        }
      ];
      setBooks(mockBooks);
      setFilteredBooks(mockBooks);
      setLoading(false);
    }, 800);
  }, []);

  // Filter books based on search, genre, and sort
  useEffect(() => {
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

  const handleAddToCart = (book) => {
    dispatch(addToCart(book));
    toast.success(`${book.title} added to cart!`);
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
                  whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }}>
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