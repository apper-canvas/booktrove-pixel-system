import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import MainFeature from '../components/MainFeature';
import { getFeaturedBooks } from '../services/bookService';

const Home = () => {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const StarIcon = getIcon('star');

  useEffect(() => {
    const loadFeaturedBooks = async () => {
      setIsLoading(true);
      try {
        const books = await getFeaturedBooks(8);
        setFeaturedBooks(books);
      } catch (error) {
        console.error("Failed to load featured books:", error);
        toast.error("Failed to load featured books");
      } finally {
        setIsLoading(false);
      }
    };

    loadFeaturedBooks();
  }, []);

  return (
    <div className="space-y-12">
      {/* Main Banner */}
      <MainFeature />

      {/* Featured Books Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Featured Books</h2>
          <Link to="/browse" className="text-primary hover:text-primary-dark dark:hover:text-primary-light">
            View all
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-surface-200 dark:bg-surface-700 rounded-lg h-64"></div>
                <div className="mt-3 bg-surface-200 dark:bg-surface-700 h-4 rounded w-3/4"></div>
                <div className="mt-2 bg-surface-200 dark:bg-surface-700 h-4 rounded w-1/2"></div>
                <div className="mt-2 bg-surface-200 dark:bg-surface-700 h-4 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredBooks.map(book => (
              <Link key={book.Id} to={`/book/${book.Id}`} className="group">
                <div className="card card-hover h-full flex flex-col">
                  <div className="relative pt-[75%] bg-surface-100 dark:bg-surface-800 overflow-hidden">
                    <img
                      src={book.cover || 'https://source.unsplash.com/random/300x400/?book'}
                      alt={book.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4 flex-grow flex flex-col">
                    <h3 className="font-semibold text-lg mb-1 line-clamp-1">{book.title}</h3>
                    <p className="text-surface-600 dark:text-surface-400 text-sm mb-2">{book.author}</p>
                    <div className="flex items-center mt-auto">
                      <span className="flex items-center text-yellow-500 mr-2">
                        <StarIcon className="w-4 h-4 mr-1" />
                        {book.rating?.toFixed(1) || "N/A"}
                      </span>
                      <span className="text-surface-600 dark:text-surface-400 text-sm">{book.genre}</span>
                      <span className="ml-auto font-semibold">${book.price?.toFixed(2) || "0.00"}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;