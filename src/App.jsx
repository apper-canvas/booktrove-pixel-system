import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import { getIcon } from './utils/iconUtils';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import { selectCartTotal } from './store/cartSlice';

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

  const cartItemCount = useSelector(selectCartTotal);

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
              
              <button className="relative p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-800" aria-label="View shopping cart">
                {(() => {
                  const ShoppingCartIcon = getIcon('shopping-cart');
                  return <ShoppingCartIcon className="w-5 h-5 text-surface-600 dark:text-surface-300" />;
                })()}
                <span className={`absolute -top-1 -right-1 bg-accent text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center ${cartItemCount === 0 ? 'hidden' : ''}`}>
                  {cartItemCount}
                </span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Home />} />
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