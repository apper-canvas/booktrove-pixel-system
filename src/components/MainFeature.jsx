import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getIcon } from '../utils/iconUtils';

const MainFeature = () => {
  const navigate = useNavigate();
  const BookIcon = getIcon('book-open');
  const ArrowRightIcon = getIcon('arrow-right');

  return (
    <div className="relative overflow-hidden rounded-2xl mb-10">
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-8 md:p-12 lg:p-16 rounded-2xl">
        <div className="absolute top-0 right-0 opacity-10">
          <BookIcon className="w-64 h-64" />
        </div>
        
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Discover Your Next Favorite Book
          </h1>
          
          <p className="text-lg md:text-xl opacity-90 mb-8">
            From bestsellers to rare finds, we have everything for book lovers.
            Browse our curated selection and find your perfect read today.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => navigate('/browse')}
              className="flex items-center bg-white text-primary px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-all"
            >
              Browse Books
              <ArrowRightIcon className="ml-2 w-4 h-4" />
            </button>
            
            <button onClick={() => navigate('/sell')} className="px-6 py-3 rounded-lg font-medium border-2 border-white bg-transparent hover:bg-white hover:bg-opacity-10 transition-all">
              Sell Your Books
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainFeature;