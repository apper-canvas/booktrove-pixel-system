import { useState, useEffect, useRef, createContext } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import { getIcon } from './utils/iconUtils';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import { setUser, clearUser } from './store/userSlice';
import { selectCartItems, selectCartTotal, selectCartAmount, updateQuantity, removeFromCart, clearCart } from './store/cartSlice';
import BrowseBooks from './pages/BrowseBooks';
import BookDetail from './pages/BookDetail';
import SellBooks from './pages/SellBooks';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Callback from './pages/Callback';
import ErrorPage from './pages/ErrorPage';

// Create auth context to share authentication state
export const AuthContext = createContext(null);

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const cartItemCount = useSelector(selectCartTotal);
  const cartItems = useSelector(selectCartItems);
  const cartAmount = useSelector(selectCartAmount);
  const userState = useSelector((state) => state.user);
  const isAuthenticated = userState?.isAuthenticated || false;

  // Check for user's preferred color scheme
  useEffect(() => {
    const darkModePreference = localStorage.getItem('darkMode') === 'true' || 
      (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDarkMode(darkModePreference);
  }, []);

  // Initialize ApperUI once when the app loads
  useEffect(() => {
    const { ApperClient, ApperUI } = window.ApperSDK;
    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Initialize but don't show login yet
    ApperUI.setup(client, {
      target: '#authentication',
      clientId: import.meta.env.VITE_APPER_PROJECT_ID,
      view: 'both',
      onSuccess: function (user) {
        setIsInitialized(true);
        // CRITICAL: This exact currentPath logic must be preserved in all implementations
        // DO NOT simplify or modify this pattern as it ensures proper redirection flow
        let currentPath = window.location.pathname + window.location.search;
        let redirectPath = new URLSearchParams(window.location.search).get('redirect');
        const isAuthPage = currentPath.includes('/login') || currentPath.includes('/signup') || currentPath.includes(
            '/callback') || currentPath.includes('/error');
        if (user) {
            // User is authenticated
            if (redirectPath) {
                navigate(redirectPath);
            } else if (!isAuthPage) {
                if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
                    navigate(currentPath);
                } else {
                    navigate('/');
                }
            } else {
                navigate('/');
            }
            // Store user information in Redux
            dispatch(setUser(JSON.parse(JSON.stringify(user))));
        } else {
            // User is not authenticated
            if (!isAuthPage) {
                navigate(
                    currentPath.includes('/signup')
                    ? `/signup?redirect=${currentPath}`
                    : currentPath.includes('/login')
                    ? `/login?redirect=${currentPath}`
                    : '/login');
            } else if (redirectPath) {
                if (
                    ![
                        'error',
                        'signup',
                        'login',
                        'callback'
                    ].some((path) => currentPath.includes(path)))
                    navigate(`/login?redirect=${redirectPath}`);
                else {
                    navigate(currentPath);
                }
            } else if (isAuthPage) {
                navigate(currentPath);
            } else {
                navigate('/login');
            }
            dispatch(clearUser());
        }
      },
      onError: function(error) {
        console.error("Authentication failed:", error);
      }
    });
  }, [dispatch, navigate]);

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

  // Auth methods to share via context
  const authMethods = {
    isInitialized,
    logout: async () => {
      try {
        const { ApperUI } = window.ApperSDK;
        await ApperUI.logout();
        dispatch(clearUser());
        navigate('/login');
        toast.info("You have been logged out");
      } catch (error) {
        console.error("Logout failed:", error);
        toast.error("Logout failed");
      }
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <AuthContext.Provider value={authMethods}>
      <div className="relative min-h-screen">
        {/* Navigation */}
        <header className="sticky top-0 z-30 bg-white dark:bg-surface-900 shadow-sm border-b border-surface-200 dark:border-surface-700">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            
            <div className="flex items-center space-x-6">
              <a href="/" className="flex items-center">
                <span className="text-xl font-bold text-primary dark:text-primary-light">BookTrove</span>
              </a>
            </div>
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
                  onClick={() => navigate('/cart')}
                  aria-label="View shopping cart" 
                  className="relative"
                >
                  {(() => {
                  const ShoppingCartIcon = getIcon('shopping-cart');
                  return <ShoppingCartIcon className="w-5 h-5 text-surface-600 dark:text-surface-300" />;
                })()}
                <span className={`absolute -top-1 -right-1 bg-accent text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center ${cartItemCount === 0 ? 'hidden' : ''}`}>
                  {cartItemCount}
                </span>
              </button>
              
              {isAuthenticated ? (
                <div className="relative flex items-center group">
                  <button className="flex items-center space-x-2 p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700">
                    <span className="text-sm font-medium hidden md:block">{userState.user?.firstName || 'User'}</span>
                    {(() => {
                      const UserIcon = getIcon('user');
                      return <UserIcon className="w-5 h-5 text-surface-600 dark:text-surface-300" />;
                    })()}
                  </button>
                  <button onClick={authMethods.logout} className="text-sm text-red-500 ml-2">
                    Logout
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/browse" element={<BrowseBooks />} />
            <Route path="/book/:id" element={<BookDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/callback" element={<Callback />} />
            <Route path="/error" element={<ErrorPage />} />
            <Route path="/sell" element={isAuthenticated ? <SellBooks /> : <Login />} />
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
    </AuthContext.Provider>
  );
};

export default App;