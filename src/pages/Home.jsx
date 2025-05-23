import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import MainFeature from '../components/MainFeature';
import { getFeaturedBooks } from '../services/bookService';

const Home = () => {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const StarIcon = getIcon('star');

  useEffect(() => {
    const loadFeaturedBooks = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const books = await getFeaturedBooks(8);
        setFeaturedBooks(books || []);
      } catch (error) {
        console.error("Failed to load featured books:", error);
        setError("Failed to load featured books");
        setFeaturedBooks([]);
        toast.error("We couldn't load the featured books. Please try again later.");
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
        ) : error ? (
          <div className="bg-red-50 dark:bg-surface-800 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
            <div className="text-red-500 mb-2 text-lg font-semibold">
              {(() => {
                const AlertIcon = getIcon('alert-circle');
                return <AlertIcon className="w-8 h-8 mx-auto mb-2" />;
              })()}
              {error}
            </div>
            <button onClick={() => window.location.reload()} className="btn btn-primary mt-4">Retry</button>
          </div>
        ) : featuredBooks.length === 0 ? (
          <div className="text-center p-10 bg-surface-100 dark:bg-surface-800 rounded-xl">
            <p className="text-lg text-surface-600 dark:text-surface-400">No featured books available at the moment.</p>
            <Link to="/browse" className="btn btn-primary mt-4">Browse All Books</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredBooks.map(book => {
              return book ? (
                <Link key={book.Id} to={`/book/${book.Id}`} className="group">
                  <div className="card card-hover h-full flex flex-col">
                    <div className="relative pt-[75%] bg-surface-100 dark:bg-surface-800 overflow-hidden">
                      <img
                        src={book.cover || 'https://source.unsplash.com/random/300x400/?book'}
                        alt={book.title || 'Book cover'}
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
              ) : null;
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;