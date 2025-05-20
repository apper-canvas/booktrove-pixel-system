import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getIcon } from '../utils/iconUtils';

const NotFound = () => {
  const navigate = useNavigate();
  
  // Auto-redirect after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [navigate]);
  
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        {(() => {
          const BookXIcon = getIcon('book-x');
          return (
            <BookXIcon className="w-24 h-24 text-primary mx-auto mb-6" />
          );
        })()}
        
        <h1 className="text-4xl font-bold mb-2">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        
        <p className="text-surface-600 dark:text-surface-400 mb-8">
          Oops! The page you're looking for seems to be missing from our bookshelf.
          You'll be redirected to the homepage in a few seconds.
        </p>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          className="btn-primary mx-auto flex items-center"
        >
          {(() => {
            const HomeIcon = getIcon('home');
            return <HomeIcon className="w-5 h-5 mr-2" />;
          })()}
          Back to Homepage
        </motion.button>
      </motion.div>
    </div>
  );
};

export default NotFound;