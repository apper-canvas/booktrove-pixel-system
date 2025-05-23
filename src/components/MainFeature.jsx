import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import { getFeaturedBooks } from '../services/bookService';

const MainFeature = () => {
  const [featuredBook, setFeaturedBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const BookOpenIcon = getIcon('book-open');
  const ShoppingCartIcon = getIcon('shopping-cart');

  useEffect(() => {
    const loadFeaturedBook = async () => {
      setIsLoading(true);
      try {
        // Get just one top-rated book for the main feature
        const books = await getFeaturedBooks(1);
        if (books && books.length > 0) {
          setFeaturedBook(books[0]);
        } else {
          // Set a fallback book if none is returned
          setFeaturedBook({
            Id: 'default',
            title: 'Discover Amazing Books',
            author: 'Browse our collection',
            description: 'Explore a world of knowledge and imagination with our extensive collection of books.',
            price: 19.99,
            cover: 'https://source.unsplash.com/random/800x600/?bookstore'
          });
        }
      } catch (error) {
        console.error("Failed to load featured book:", error);
        // Don't show toast for initial load failures to avoid overwhelming the user
        setFeaturedBook({
          Id: 'default',
          title: 'Discover Amazing Books',
          author: 'Browse our collection',
          description: 'Explore a world of knowledge and imagination with our extensive collection of books.',
          price: 19.99,
          cover: 'https://source.unsplash.com/random/800x600/?bookstore'
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadFeaturedBook();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-96 rounded-xl bg-surface-200 dark:bg-surface-800 animate-pulse">
        <div className="h-full flex items-center justify-center">
          <span className="text-surface-400 dark:text-surface-600">Loading featured book...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/80 to-primary-dark h-[500px] flex items-center">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={featuredBook?.cover || 'https://source.unsplash.com/random/1200x800/?books'} 
          alt="Featured book background" 
          className="w-full h-full object-cover opacity-20"
        />
      </div>
      
      <div className="container mx-auto px-4 z-10 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-8 md:mb-0 text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{featuredBook?.title || 'Discover Amazing Books'}</h1>
          <p className="text-xl md:text-2xl mb-2">{featuredBook?.author || 'Browse our collection'}</p>
          <p className="mb-6 text-white/80 line-clamp-3">
            {featuredBook?.description || 'Explore a world of knowledge and imagination with our extensive collection of books.'}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/browse" className="btn bg-white text-primary hover:bg-surface-100 flex items-center">
              <BookOpenIcon className="w-5 h-5 mr-2" /> Browse Books
            </Link>
            <Link to={featuredBook?.Id !== 'default' ? `/book/${featuredBook?.Id}` : '/browse'} className="btn btn-outline border-white text-white hover:bg-white/20 hover:text-white flex items-center">
              <ShoppingCartIcon className="w-5 h-5 mr-2" /> View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainFeature;