import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import { addToCart } from '../store/cartSlice';
import { getBookById } from '../services/bookService';

const BookDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const userState = useSelector((state) => state.user);
  const isAuthenticated = userState?.isAuthenticated || false;

  useEffect(() => {
    // Fetch book details using the service
    setLoading(true);
    setError(null);
    
    const fetchBookDetails = async () => {
      try {
        const bookData = await getBookById(id);

        if (bookData) {
          // Transform the data to match the expected format
          const transformedBook = {
            id: bookData.Id,
            title: bookData.title || bookData.Name,
            author: bookData.author || 'Unknown',
            description: bookData.description || '',
            price: bookData.price || 0,
            cover: bookData.cover || 'https://source.unsplash.com/FHQ2B9U9DCA/400x600', // Default image
            rating: bookData.rating || 0,
            genre: bookData.genre || 'Unknown',
            condition: bookData.condition || 'New',
            publishDate: bookData.publishDate || new Date().toISOString().substring(0, 10),
            publisher: bookData.publisher || 'Unknown',
            pages: bookData.pages || 0,
            isbn: bookData.isbn || 'Unknown',
            language: bookData.language || 'English'
          };
          
          setBook(transformedBook);
        } else {
          setError("Book not found");
        }
      } catch (err) {
        setError("Failed to load book details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookDetails();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.info('Please log in to add items to your cart');
      return;
    }
    if (book) {
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-r-transparent mb-4"></div>
        <p className="text-surface-600 dark:text-surface-400">Loading book details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 text-center">
        <div className="text-6xl mb-4">📚</div>
        <h3 className="text-xl font-semibold mb-2">Error</h3>
        <p className="text-surface-600 dark:text-surface-400 mb-4">{error}</p>
        <Link to="/browse" className="btn-primary">
          Back to Browse
        </Link>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="py-20 text-center">
        <div className="text-6xl mb-4">📚</div>
        <h3 className="text-xl font-semibold mb-2">Book Not Found</h3>
        <p className="text-surface-600 dark:text-surface-400 mb-4">The book you're looking for doesn't exist or has been removed.</p>
        <Link to="/browse" className="btn-primary">
          Back to Browse
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center">
        <Link to="/browse" className="text-primary flex items-center text-sm">
          <span className="mr-1">Back to Browse</span>
          {(() => {
            const ArrowLeftIcon = getIcon('arrow-left');
            return <ArrowLeftIcon className="w-4 h-4" />;
          })()}
        </Link>
      </div>

      <div className="bg-white dark:bg-surface-800 rounded-xl shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3 p-6">
            <img src={book.cover} alt={book.title} className="w-full h-auto object-cover rounded-lg shadow-md" />
          </div>
          <div className="md:w-2/3 p-6">
            <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
            <p className="text-xl text-surface-600 dark:text-surface-400 mb-4">by {book.author}</p>
            
            <div className="flex items-center mb-4">
              <div className="flex mr-2">
                {Array.from({ length: 5 }).map((_, i) => {
                  const StarIcon = getIcon(i < Math.floor(book.rating) ? 'star' : 'star-outline');
                  return (
                    <StarIcon 
                      key={i} 
                      className={`w-5 h-5 ${i < Math.floor(book.rating) ? 'text-amber-400' : 'text-surface-300'}`} 
                    />
                  );
                })}
              </div>
              <span className="text-surface-500">({book.rating})</span>
            </div>
            
            <div className="mb-4">
              <span className="bg-accent text-white text-lg font-bold px-4 py-2 rounded">
                ${book.price.toFixed(2)}
              </span>
            </div>
            
            <div className="mb-6">
              <span className="text-sm font-medium px-3 py-1 bg-surface-100 dark:bg-surface-700 rounded-full mr-2">
                {book.genre.charAt(0).toUpperCase() + book.genre.slice(1)}
              </span>
              <span className="text-sm font-medium px-3 py-1 bg-surface-100 dark:bg-surface-700 rounded-full">
                {book.condition}
              </span>
            </div>
            
            <button
              className="btn-accent w-full md:w-auto mb-4"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
            
            <div className="border-t border-surface-200 dark:border-surface-700 pt-4 mt-4">
              <h3 className="font-bold text-lg mb-2">Description</h3>
              <p className="text-surface-700 dark:text-surface-300 mb-4">{book.description}</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-surface-500 dark:text-surface-400">Published</p>
                  <p className="font-medium">{book.publishDate}</p>
                </div>
                <div>
                  <p className="text-surface-500 dark:text-surface-400">Publisher</p>
                  <p className="font-medium">{book.publisher}</p>
                </div>
                <div>
                  <p className="text-surface-500 dark:text-surface-400">Pages</p>
                  <p className="font-medium">{book.pages}</p>
                </div>
                <div>
                  <p className="text-surface-500 dark:text-surface-400">ISBN</p>
                  <p className="font-medium">{book.isbn}</p>
                </div>
                <div>
                  <p className="text-surface-500 dark:text-surface-400">Language</p>
                  <p className="font-medium">{book.language}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;