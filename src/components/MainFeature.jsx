import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';

const MainFeature = () => {
  const [searchParams, setSearchParams] = useState({
    query: '',
    category: '',
    condition: '',
    minPrice: '',
    maxPrice: '',
  });
  
  const [isAdvancedSearch, setIsAdvancedSearch] = useState(false);
              <span className="text-sm font-medium dark:text-surface-200">{book.rating} · {book.reviews} reviews</span>
  const [searchResults, setSearchResults] = useState([]);
  
            <h2 className="text-xl font-bold mb-2 dark:text-surface-100">{book.title}</h2>
    { id: '', name: 'All Categories' },
    { id: 'fiction', name: 'Fiction' },
    { id: 'non-fiction', name: 'Non-Fiction' },
    { id: 'mystery', name: 'Mystery & Thriller' },
    { id: 'scifi', name: 'Science Fiction' },
    { id: 'fantasy', name: 'Fantasy' },
    { id: 'romance', name: 'Romance' },
    { id: 'biography', name: 'Biography' },
  ];
  
  const conditions = [
    { id: '', name: 'Any Condition' },
    { id: 'new', name: 'New' },
    { id: 'like-new', name: 'Like New' },
    { id: 'good', name: 'Good' },
    { id: 'fair', name: 'Fair' },
    { id: 'poor', name: 'Poor' },
  ];
  
  // Sample book data for search results
  const bookDatabase = [
    {
      id: 1,
      title: "The Midnight Library",
      author: "Matt Haig",
      cover: "https://source.unsplash.com/FHQ2B9U9DCA/400x600",
      price: 16.99,
      category: "fiction",
      condition: "new",
      description: "Between life and death there is a library."
    },
    {
      id: 2,
      title: "Project Hail Mary",
      author: "Andy Weir",
      cover: "https://source.unsplash.com/cckf4TsHAuw/400x600",
      price: 19.99,
      category: "scifi",
      condition: "new",
      description: "A lone astronaut must save the earth from disaster."
    },
    {
      id: 3,
      title: "Atomic Habits",
      author: "James Clear",
      cover: "https://source.unsplash.com/YLSwjSy7stw/400x600",
      price: 14.99,
      category: "non-fiction",
      condition: "like-new",
      description: "Tiny changes, remarkable results."
    },
    {
      id: 4,
      title: "The Silent Patient",
      author: "Alex Michaelides",
      cover: "https://source.unsplash.com/NIJuEQw0RKg/400x600",
      price: 12.99,
      category: "mystery",
      condition: "good",
      description: "A psychological thriller that will keep you guessing."
    },
    {
      id: 5,
      title: "Becoming",
      author: "Michelle Obama",
      cover: "https://source.unsplash.com/2JIvboGLeho/400x600",
      price: 24.99,
      category: "biography",
      condition: "new",
      description: "An intimate and powerful memoir by the former First Lady."
    },
    {
      id: 6,
      title: "The Way of Kings",
      author: "Brandon Sanderson",
      cover: "https://source.unsplash.com/kkZRcpuzYV0/400x600",
      price: 22.99,
      category: "fantasy",
      condition: "good",
      description: "Epic fantasy at its finest."
    }
  ];
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  // Toggle advanced search panel
  const toggleAdvancedSearch = () => {
    setIsAdvancedSearch((prev) => !prev);
  };
  
  // Perform search
  const handleSearch = (e) => {
    e.preventDefault();
    
    if (!searchParams.query && !searchParams.category && !searchParams.condition && !searchParams.minPrice && !searchParams.maxPrice) {
      toast.error("Please enter at least one search parameter");
      return;
    }
    
    setIsSearching(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Filter books based on search parameters
      const results = bookDatabase.filter((book) => {
        // Match by title or author (case insensitive)
        const matchesQuery = !searchParams.query || 
          book.title.toLowerCase().includes(searchParams.query.toLowerCase()) ||
          book.author.toLowerCase().includes(searchParams.query.toLowerCase());
        
        // Match by category
        const matchesCategory = !searchParams.category || book.category === searchParams.category;
        
        // Match by condition
        const matchesCondition = !searchParams.condition || book.condition === searchParams.condition;
        
        // Match by price range
        const matchesMinPrice = !searchParams.minPrice || book.price >= parseFloat(searchParams.minPrice);
        const matchesMaxPrice = !searchParams.maxPrice || book.price <= parseFloat(searchParams.maxPrice);
        
        return matchesQuery && matchesCategory && matchesCondition && matchesMinPrice && matchesMaxPrice;
      });
      
      setSearchResults(results);
      setIsSearching(false);
      
      if (results.length === 0) {
        toast.info("No books found matching your criteria");
      } else {
        toast.success(`Found ${results.length} book${results.length === 1 ? '' : 's'}`);
      }
    }, 800);
  };
  
  // Add book to cart
  const addToCart = (book) => {
    toast.success(`${book.title} added to cart!`);
  };
  
  // Clear search form
  const clearSearch = () => {
    setSearchParams({
      query: '',
      category: '',
      condition: '',
      minPrice: '',
      maxPrice: '',
    });
    setSearchResults([]);
  };

  return (
    <section className="space-y-6">
      <div className="card p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          {(() => {
            const SearchIcon = getIcon('search');
            return <SearchIcon className="w-6 h-6 mr-2 text-primary" />;
          })()}
          Book Search
        </h2>
        
        <form onSubmit={handleSearch} className="space-y-4">
          {/* Basic Search */}
          <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
            <div className="flex-grow">
              <label htmlFor="query" className="label">Search by Title, Author or ISBN</label>
              <div className="relative">
                {(() => {
                  const BookOpenIcon = getIcon('book-open');
                  return (
                    <BookOpenIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 w-5 h-5" />
                  );
                })()}
                <input
                  type="text"
                  id="query"
                  name="query"
                  value={searchParams.query}
                  onChange={handleInputChange}
                  placeholder="Harry Potter, J.K. Rowling, 9780747532743..."
                  className="input pl-10"
                />
              </div>
            </div>
            
            <div className="w-full md:w-1/4">
              <label htmlFor="category" className="label">Category</label>
              <select
                id="category"
                name="category"
                value={searchParams.category}
                onChange={handleInputChange}
                className="input"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Advanced Search Options */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={toggleAdvancedSearch}
              className="text-sm flex items-center text-primary dark:text-primary-light"
            >
              {isAdvancedSearch ? 'Hide' : 'Show'} Advanced Options
              {(() => {
                const ChevronIcon = getIcon(isAdvancedSearch ? 'chevron-up' : 'chevron-down');
                return <ChevronIcon className="w-4 h-4 ml-1" />;
              })()}
            </button>
          </div>
          
          {/* Advanced Search Panel */}
          <AnimatePresence>
            {isAdvancedSearch && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="pt-2 space-y-4 border-t border-surface-200 dark:border-surface-700">
                  <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                    <div className="w-full sm:w-1/2">
                      <label htmlFor="condition" className="label">Condition</label>
                      <select
                        id="condition"
                        name="condition"
                        value={searchParams.condition}
                        onChange={handleInputChange}
                        className="input"
                      >
                        {conditions.map((condition) => (
                          <option key={condition.id} value={condition.id}>
                            {condition.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="w-full sm:w-1/2 flex space-x-4">
                      <div className="w-1/2">
                        <label htmlFor="minPrice" className="label">Min Price ($)</label>
                        <input
                          type="number"
                          id="minPrice"
                          name="minPrice"
                          value={searchParams.minPrice}
                          onChange={handleInputChange}
                          placeholder="0"
                          min="0"
                          step="0.01"
                          className="input"
                        />
                      </div>
                      
                      <div className="w-1/2">
                        <label htmlFor="maxPrice" className="label">Max Price ($)</label>
                        <input
                          type="number"
                          id="maxPrice"
                          name="maxPrice"
                          value={searchParams.maxPrice}
                          onChange={handleInputChange}
                          placeholder="999"
                          min="0"
                          step="0.01"
                          className="input"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Search Buttons */}
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-2">
            <button
              type="button"
              onClick={clearSearch}
              className="btn border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800"
            >
              Clear
            </button>
            
            <button
              type="submit"
              disabled={isSearching}
              className="btn-primary flex items-center justify-center"
            >
              {isSearching ? (
                <>
                  {(() => {
                    const LoaderIcon = getIcon('loader');
                    return <LoaderIcon className="w-5 h-5 mr-2 animate-spin" />;
                  })()}
                  Searching...
                </>
              ) : (
                <>
                  {(() => {
                    const SearchIcon = getIcon('search');
                    return <SearchIcon className="w-5 h-5 mr-2" />;
                  })()}
                  Search Books
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      
      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Search Results ({searchResults.length})</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((book) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card overflow-hidden"
              >
                <div className="flex h-full">
                  <div className="w-1/3 h-full">
                    <img 
                      src={book.cover} 
                      alt={book.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="w-2/3 p-4 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-lg line-clamp-1">{book.title}</h4>
                      <p className="text-surface-600 dark:text-surface-400 text-sm mb-1">by {book.author}</p>
                      <p className="text-surface-500 dark:text-surface-400 text-xs mb-2 line-clamp-2">{book.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                          {categories.find(cat => cat.id === book.category)?.name || book.category}
                        </span>
                        <span className="text-xs px-2 py-0.5 bg-secondary/10 text-secondary rounded-full">
                          {conditions.find(cond => cond.id === book.condition)?.name || book.condition}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-bold text-accent">${book.price.toFixed(2)}</span>
                      <button
                        onClick={() => addToCart(book)}
                        className="btn-accent py-1 text-sm"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default MainFeature;