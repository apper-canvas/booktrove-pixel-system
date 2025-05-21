import { useState, useEffect, useRef } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import { getIcon } from './utils/iconUtils';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import { selectCartItems, selectCartTotal, selectCartAmount, updateQuantity, removeFromCart, clearCart } from './store/cartSlice';
import BrowseBooks from './pages/BrowseBooks';
import BookDetail from './pages/BookDetail';
import SellBooks from './pages/SellBooks';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check for user's preferred color scheme
  useEffect(() => {
    const darkModePreference = localStorage.getItem('darkMode') === 'true' || 
      (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    setIsDarkMode(darkModePreference);
  }, []);

  // Update DOM when dark mode changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const cartItemCount = useSelector(selectCartTotal);
  const cartItems = useSelector(selectCartItems);
  const cartAmount = useSelector(selectCartAmount);
  
  const toggleCart = () => {
    setIsCartOpen(prev => !prev);
  };
  
  
  return (
    <>
      <div className="relative min-h-screen">
        {/* Navigation */}
        <header className="sticky top-0 z-10 bg-white dark:bg-surface-900 shadow-sm border-b border-surface-200 dark:border-surface-700">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <a href="/" className="flex items-center space-x-2">
              {(() => {
                const BookIcon = getIcon('book');
                return <BookIcon className="w-6 h-6 text-primary" />;
              })()}
              <span className="text-xl font-bold text-primary">BookTrove</span>
            </a>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={toggleDarkMode}
                className="p-2 rounded-full bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors duration-200"
                aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDarkMode ? (
                  (() => {
                    const SunIcon = getIcon('sun');
                    return <SunIcon className="w-5 h-5 text-yellow-400 transition-transform duration-200" />;
                  })()
                ) : (
                  (() => {
                    const MoonIcon = getIcon('moon');
                    return <MoonIcon className="w-5 h-5 text-surface-700 transition-transform duration-200" />;
                  })()
                )}
              </button>
              
              <button 
                onClick={toggleCart}
                className="relative p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-800" 
                aria-label="View shopping cart"
              >
                {(() => {
                  const ShoppingCartIcon = getIcon('shopping-cart');
                  return <ShoppingCartIcon className="w-5 h-5 text-surface-600 dark:text-surface-300" />;
                })()}
                <span className={`absolute -top-1 -right-1 bg-accent text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center ${cartItemCount === 0 ? 'hidden' : ''}`}>
                  {cartItemCount}
                </span>
              </button>
              
              {/* Cart Drawer */}
              <div 
                ref={cartRef}
                className={`fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white dark:bg-surface-800 shadow-xl transform transition-transform duration-300 ease-in-out ${
                  isCartOpen ? 'translate-x-0' : 'translate-x-full'
                } flex flex-col`}
              >
                <div className="p-4 border-b border-surface-200 dark:border-surface-700 flex justify-between items-center">
                  <h2 className="text-xl font-bold flex items-center">
                    {(() => {
                      const ShoppingCartIcon = getIcon('shopping-cart');
                      return <ShoppingCartIcon className="w-5 h-5 mr-2" />;
                    })()}
                    Your Cart ({cartItemCount})
                  </h2>
                  <button 
                    onClick={toggleCart}
                    className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
                    aria-label="Close cart"
                  >
                    {(() => {
                      const XIcon = getIcon('x');
                      return <XIcon className="w-5 h-5" />;
                    })()}
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4">
                  {cartItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      {(() => {
                        const ShoppingBagIcon = getIcon('shopping-bag');
                        return <ShoppingBagIcon className="w-16 h-16 text-surface-300 mb-4" />;
                      })()}
                      <p className="text-surface-500 dark:text-surface-400 mb-2">Your cart is empty</p>
                      <button 
                        onClick={toggleCart}
                        className="btn-primary text-sm"
                      >
                        Continue Shopping
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cartItems.map(item => (
                        <div key={item.id} className="flex border-b border-surface-200 dark:border-surface-700 pb-4">
                          <img src={item.cover} alt={item.title} className="w-20 h-28 object-cover rounded-md mr-3" />
                          <div className="flex-1">
                            <h3 className="font-medium text-surface-800 dark:text-surface-100">{item.title}</h3>
                            <p className="text-sm text-surface-500 dark:text-surface-400">{item.author}</p>
                            <p className="text-accent font-medium mt-1">${item.price.toFixed(2)}</p>
                            <div className="flex items-center mt-2">
                              <button 
                                onClick={() => dispatch(updateQuantity({ id: item.id, quantity: Math.max(1, item.quantity - 1) }))}
                                className="p-1 rounded-full bg-surface-100 dark:bg-surface-700"
                              >
                                {(() => { const MinusIcon = getIcon('minus'); return <MinusIcon className="w-4 h-4" />; })()}
                              </button>
                              <span className="mx-2 w-6 text-center">{item.quantity}</span>
                              <button 
                                onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                                className="p-1 rounded-full bg-surface-100 dark:bg-surface-700"
                              >
                                {(() => { const PlusIcon = getIcon('plus'); return <PlusIcon className="w-4 h-4" />; })()}
                              </button>
                              <button 
                                onClick={() => {
                                  dispatch(removeFromCart(item.id));
                                  toast.error(`${item.title} removed from cart`);
                                }}
                                className="ml-auto p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
                              >
                                {(() => { const TrashIcon = getIcon('trash-2'); return <TrashIcon className="w-4 h-4" />; })()}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {cartItems.length > 0 && (
                  <div className="p-4 border-t border-surface-200 dark:border-surface-700">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Subtotal:</span>
                      <span className="font-bold">${cartAmount.toFixed(2)}</span>
                    </div>
                    <button 
                      className="btn-primary w-full mb-2"
                      onClick={() => {
                        setIsCartOpen(false);
                        navigate('/checkout');
                      }}
                      disabled={cartItems.length === 0}
                    >
                      Checkout
                    </button>
                    <button 
                      className="btn-outline w-full"
                      onClick={() => {
                        dispatch(clearCart());
                        toast.info('Cart has been cleared');
                      }}
                    >
                      Clear Cart
                    </button>
                  </div>
                )}
              </div>
              
              {/* Overlay when cart is open */}
              {isCartOpen && (
                <div 
                  className="fixed inset-0 bg-black/50 z-40"
                  onClick={toggleCart}
                />
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/browse" element={<BrowseBooks />} />
            <Route path="/book/:id" element={<BookDetail />} />
            <Route path="/sell" element={<SellBooks />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-white dark:bg-surface-900 border-t border-surface-200 dark:border-surface-700 py-6">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <p className="text-sm text-surface-500 dark:text-surface-400">
                  © 2023 BookTrove. All rights reserved.
                </p>
              </div>
              <div className="flex space-x-4">
                {['facebook', 'twitter', 'instagram'].map(platform => (
                  <a 
                    key={platform}
                    href={`https://${platform}.com`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-surface-500 hover:text-primary dark:text-surface-400 dark:hover:text-primary-light"
                  >
                    {(() => {
                      const Icon = getIcon(platform);
                      return <Icon className="w-5 h-5" />;
                    })()}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Toast Container */}
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={isDarkMode ? "dark" : "light"}
      />
    </>
  );
};

export default App;