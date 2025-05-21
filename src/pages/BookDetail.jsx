import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import { addToCart } from '../store/cartSlice';

const BookDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate API loading delay for fetching a specific book
    setLoading(true);
    setTimeout(() => {
      try {
        // In a real app, this would be an API call like:
        // fetch(`/api/books/${id}`).then(res => res.json()).then(data => setBook(data))
        
        // Mock book data
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
            description: "Between life and death there is a library. When Nora finds herself in the Midnight Library, she has a chance to make things right. Up until now, her life has been full of misery and regret. She feels she has let everyone down, including herself. But things are about to change.",
            publishDate: "2020-08-13",
            publisher: "Canongate Books",
            pages: 304,
            isbn: "9781786892720",
            language: "English"
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
            description: "A lone astronaut must save the earth from disaster in this incredible new science-based thriller from the #1 New York Times bestselling author of The Martian. Ryland Grace is the sole survivor on a desperate, last-chance mission—and if he fails, humanity and the earth itself will perish.",
            publishDate: "2021-05-04",
            publisher: "Ballantine Books",
            pages: 496,
            isbn: "9780593135204",
            language: "English"
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
            description: "The bestselling author of Give and Take and Originals examines the critical art of rethinking: learning to question your opinions and open other people's minds. Intelligence is usually seen as the ability to think and learn, but in a rapidly changing world, there's another set of cognitive skills that might matter more: the ability to rethink and unlearn.",
            publishDate: "2021-02-02",
            publisher: "Viking",
            pages: 320,
            isbn: "9781984878106",
            language: "English"
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
            description: "The Silent Patient is a shocking psychological thriller of a woman's act of violence against her husband—and of the therapist obsessed with uncovering her motive. Alicia Berenson's life is seemingly perfect. A famous painter married to an in-demand fashion photographer, she lives in a grand house overlooking a park in one of London's most desirable areas.",
            publishDate: "2019-02-05",
            publisher: "Celadon Books",
            pages: 336,
            isbn: "9781250301697",
            language: "English"
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
            description: "In her memoir, a work of deep reflection and mesmerizing storytelling, Michelle Obama invites readers into her world, chronicling the experiences that have shaped her. From her childhood on the South Side of Chicago to her years as an executive balancing the demands of motherhood and work, to her time spent at the world's most famous address.",
            publishDate: "2018-11-13",
            publisher: "Crown",
            pages: 448,
            isbn: "9781524763138",
            language: "English"
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
            description: "One Ring to rule them all, One Ring to find them, One Ring to bring them all and in the darkness bind them. In ancient times the Rings of Power were crafted by the Elven-smiths, and Sauron, the Dark Lord, forged the One Ring, filling it with his own power so that he could rule all others.",
            publishDate: "1954-07-29",
            publisher: "Allen & Unwin",
            pages: 1178,
            isbn: "9780618640157",
            language: "English"
          }
        ];

        const foundBook = mockBooks.find(b => b.id === parseInt(id));
        
        if (foundBook) {
          setBook(foundBook);
        } else {
          setError("Book not found");
        }
      } catch (err) {
        setError("Failed to load book details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 800);
  }, [id]);

  const handleAddToCart = () => {
    if (book) {
      dispatch(addToCart(book));
      toast.success(`${book.title} added to cart!`);
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