import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import { useSelector } from 'react-redux';
import { createListing } from '../services/listingService';

// Component for selling books
const SellBooks = () => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    genre: '',
    condition: 'new',
    price: '',
    coverImage: null,
    coverPreview: null
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  // Get user state from Redux
  const userState = useSelector(state => state.user);
  const userId = userState?.user?.userId;
  
  const conditions = [
    { value: 'new', label: 'New' },
    { value: 'like-new', label: 'Like New' },
    { value: 'very-good', label: 'Very Good' },
    { value: 'good', label: 'Good' },
    { value: 'acceptable', label: 'Acceptable' }
  ];
  
  const genres = [
    { value: '', label: 'Select a genre' },
    { value: 'fiction', label: 'Fiction' },
    { value: 'non-fiction', label: 'Non-Fiction' },
    { value: 'mystery', label: 'Mystery & Thriller' },
    { value: 'scifi', label: 'Sci-Fi & Fantasy' },
    { value: 'biography', label: 'Biography' },
    { value: 'history', label: 'History' },
    { value: 'children', label: 'Children' },
    { value: 'cooking', label: 'Cooking' },
    { value: 'art', label: 'Art & Photography' },
    { value: 'self-help', label: 'Self Help' },
    { value: 'other', label: 'Other' }
  ];
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.match('image.*')) {
      setFormErrors(prev => ({ 
        ...prev, 
        coverImage: 'Please upload an image file (JPG, PNG, etc.)' 
      }));
      return;
    }
    
    // Create preview URL
    const reader = new FileReader();
    reader.onload = () => {
      setFormData(prev => ({ 
        ...prev, 
        coverImage: file,
        coverPreview: reader.result 
      }));
    };
    reader.readAsDataURL(file);
    
    // Clear error
    setFormErrors(prev => ({ ...prev, coverImage: null }));
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.author.trim()) errors.author = 'Author name is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.genre) errors.genre = 'Please select a genre';
    
    if (!formData.price) {
      errors.price = 'Price is required';
    } else if (isNaN(formData.price) || formData.price <= 0) {
      errors.price = 'Please enter a valid price greater than 0';
    }
    
    if (!formData.coverImage) errors.coverImage = 'Cover image is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
  const handleSubmit = async (e) => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    
    // For this example, we'll assume the image URL is already available
    // In a real application, you would upload the image first, then use the URL
    const coverImageUrl = formData.coverPreview || "https://source.unsplash.com/random/400x600/?book";
    
    try {
      // Submit the listing using the service
      await createListing({
        ...formData,
        coverImageUrl
      }, userId);
      
      // Show success message
      toast.success('Your book has been listed for sale!');
      
      // Reset form
      setFormData({
        title: '',
        author: '',
        description: '',
        genre: '',
        condition: 'new',
        price: '',
        coverImage: null,
        coverPreview: null
      });
      
      // Redirect to home or listings page
      navigate('/');
    } catch (error) {
      toast.error('Failed to create listing: ' + (error.message || 'Unknown error'));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Sell Your Books</h1>
        <Link to="/" className="text-primary flex items-center text-sm">
          <span className="mr-1">Back to Home</span>
          {(() => {
            const HomeIcon = getIcon('home');
            return <HomeIcon className="w-4 h-4" />;
          })()}
        </Link>
      </div>
      
      <div className="card p-6">
        <p className="text-surface-600 dark:text-surface-400 mb-4">
          Fill out the form below to list your book for sale on BookTrove. All listings are reviewed within 24 hours.
        </p>
        
        {!userId && (
          <div className="bg-yellow-100 dark:bg-yellow-900/30 border-l-4 border-yellow-500 p-4 mb-6">
            <p className="text-yellow-700 dark:text-yellow-400">
              You need to be logged in to list books for sale. Please <Link to="/login" className="font-bold underline">log in</Link> first.
            </p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className={!userId ? "opacity-60 pointer-events-none" : ""}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="title" className="label">Book Title*</label>
              <input 
                type="text" 
                id="title" 
                name="title" 
                className={`input ${formErrors.title ? 'border-red-500' : ''}`}
                value={formData.title}
                onChange={handleInputChange}
              />
              {formErrors.title && <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>}
            </div>
            
            <div>
              <label htmlFor="author" className="label">Author Name*</label>
              <input 
                type="text" 
                id="author" 
                name="author" 
                className={`input ${formErrors.author ? 'border-red-500' : ''}`}
                value={formData.author}
                onChange={handleInputChange}
              />
              {formErrors.author && <p className="text-red-500 text-xs mt-1">{formErrors.author}</p>}
            </div>
            
            <div>
              <label htmlFor="genre" className="label">Genre*</label>
              <select 
                id="genre" 
                name="genre" 
                className={`input ${formErrors.genre ? 'border-red-500' : ''}`}
                value={formData.genre}
                onChange={handleInputChange}
              >
                {genres.map(genre => (
                  <option key={genre.value} value={genre.value}>{genre.label}</option>
                ))}
              </select>
              {formErrors.genre && <p className="text-red-500 text-xs mt-1">{formErrors.genre}</p>}
            </div>
            
            <div>
              <label htmlFor="condition" className="label">Condition*</label>
              <select 
                id="condition" 
                name="condition" 
                className="input"
                value={formData.condition}
                onChange={handleInputChange}
              >
                {conditions.map(condition => (
                  <option key={condition.value} value={condition.value}>{condition.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="price" className="label">Price ($)*</label>
              <input 
                type="number" 
                id="price" 
                name="price" 
                min="0.01" 
                step="0.01" 
                className={`input ${formErrors.price ? 'border-red-500' : ''}`}
                value={formData.price}
                onChange={handleInputChange}
                placeholder="19.99"
              />
              {formErrors.price && <p className="text-red-500 text-xs mt-1">{formErrors.price}</p>}
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="description" className="label">Description*</label>
              <textarea 
                id="description" 
                name="description" 
                rows="4" 
                className={`input ${formErrors.description ? 'border-red-500' : ''}`}
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Provide a brief description of your book"
              ></textarea>
              {formErrors.description && <p className="text-red-500 text-xs mt-1">{formErrors.description}</p>}
            </div>
            
            <div className="md:col-span-2">
              <label className="label">Cover Image*</label>
              <div className="flex items-start gap-4">
                <div className={`border-2 border-dashed rounded-lg p-4 ${formErrors.coverImage ? 'border-red-500' : 'border-surface-300 dark:border-surface-600'} flex-1`}>
                  <div className="flex flex-col items-center justify-center">
                    <div className="mb-2">
                      {(() => {
                        const UploadIcon = getIcon('upload');
                        return <UploadIcon className="w-8 h-8 text-surface-400" />;
                      })()}
                    </div>
                    <p className="text-sm text-surface-600 dark:text-surface-400 mb-2">Drag & drop your cover image here</p>
                    <p className="text-xs text-surface-500 mb-2">JPG, PNG, or GIF (max 2MB)</p>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="coverImage"
                      onChange={handleImageUpload}
                    />
                    <label htmlFor="coverImage" className="btn-primary text-sm cursor-pointer">
                      Select Image
                    </label>
                    {formErrors.coverImage && <p className="text-red-500 text-xs mt-2">{formErrors.coverImage}</p>}
                  </div>
                </div>
                
                {formData.coverPreview && (
                  <div className="h-40 w-28 overflow-hidden rounded-lg border border-surface-200 dark:border-surface-700">
                    <img 
                      src={formData.coverPreview} 
                      alt="Cover preview" 
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end">
            <Link to="/" className="btn-outline mr-4">
              Cancel
            </Link>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={isSubmitting || !userId}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : 'List Book for Sale'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellBooks;