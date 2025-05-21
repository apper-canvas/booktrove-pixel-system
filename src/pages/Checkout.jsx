import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import { selectCartItems, selectCartAmount, clearCart } from '../store/cartSlice';

const Checkout = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const cartItems = useSelector(selectCartItems);
  const cartAmount = useSelector(selectCartAmount);
  
  // Form state
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    email: '',
    phone: ''
  });
  
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });
  
  // Form validation
  const [errors, setErrors] = useState({});
  
  const validateShippingForm = () => {
    const newErrors = {};
    if (!shippingInfo.fullName) newErrors.fullName = 'Full name is required';
    if (!shippingInfo.address) newErrors.address = 'Address is required';
    if (!shippingInfo.city) newErrors.city = 'City is required';
    if (!shippingInfo.state) newErrors.state = 'State is required';
    if (!shippingInfo.zipCode) newErrors.zipCode = 'ZIP code is required';
    if (!shippingInfo.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(shippingInfo.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const validatePaymentForm = () => {
    const newErrors = {};
    if (!paymentInfo.cardNumber) newErrors.cardNumber = 'Card number is required';
    if (!paymentInfo.cardHolder) newErrors.cardHolder = 'Card holder name is required';
    if (!paymentInfo.expiryDate) newErrors.expiryDate = 'Expiry date is required';
    if (!paymentInfo.cvv) newErrors.cvv = 'CVV is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle input changes
  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo({
      ...shippingInfo,
      [name]: value
    });
  };
  
  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo({
      ...paymentInfo,
      [name]: value
    });
  };
  
  // Navigation between steps
  const nextStep = () => {
    if (step === 1) {
      // Validate cart is not empty
      if (cartItems.length === 0) {
        toast.error("Your cart is empty. Please add items before checkout.");
        navigate('/browse');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (validateShippingForm()) {
        setStep(3);
      }
    } else if (step === 3) {
      if (validatePaymentForm()) {
        placeOrder();
      }
    }
  };
  
  const prevStep = () => {
    setStep(step - 1);
  };
  
  // Submit order
  const placeOrder = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      
      // Generate order number
      const orderNumber = Math.floor(100000 + Math.random() * 900000);
      
      // Create order object to potentially send to backend
      const order = {
        orderNumber,
        items: cartItems,
        total: cartAmount,
        shipping: shippingInfo,
        payment: {
          ...paymentInfo,
          // For security, only store last 4 digits in frontend
          cardNumber: `xxxx-xxxx-xxxx-${paymentInfo.cardNumber.slice(-4)}`
        },
        date: new Date().toISOString()
      };
      
      // Store order in session storage for confirmation page
      sessionStorage.setItem('lastOrder', JSON.stringify(order));
      
      // Clear cart
      dispatch(clearCart());
      
      // Show success message
      toast.success('Order placed successfully!');
      
      // Navigate to confirmation page
      navigate('/order-confirmation');
    }, 2000);
  };
  
  // Render step content
  const renderStepContent = () => {
    switch(step) {
      case 1:
        return (
          <div className="bg-white dark:bg-surface-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-4 mb-6">
              {cartItems.map(item => (
                <div key={item.id} className="flex border-b border-surface-200 dark:border-surface-700 pb-3">
                  <img src={item.cover} alt={item.title} className="w-16 h-20 object-cover rounded-md mr-3" />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-sm text-surface-500 dark:text-surface-400">{item.author}</p>
                    <div className="flex justify-between mt-1">
                      <p>${item.price.toFixed(2)} × {item.quantity}</p>
                      <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-surface-200 dark:border-surface-700 pt-4">
              <div className="flex justify-between text-lg font-bold mb-6">
                <span>Total:</span>
                <span>${cartAmount.toFixed(2)}</span>
              </div>
              <button 
                className="btn-primary w-full"
                onClick={nextStep}
              >
                Proceed to Shipping
              </button>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="bg-white dark:bg-surface-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Shipping Information</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="fullName" className="label">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={shippingInfo.fullName}
                  onChange={handleShippingChange}
                  className="input"
                  placeholder="John Doe"
                />
                {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
              </div>
              <div>
                <label htmlFor="address" className="label">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={shippingInfo.address}
                  onChange={handleShippingChange}
                  className="input"
                  placeholder="123 Book Street"
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="label">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleShippingChange}
                    className="input"
                    placeholder="Booktown"
                  />
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                </div>
                <div>
                  <label htmlFor="state" className="label">State</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={shippingInfo.state}
                    onChange={handleShippingChange}
                    className="input"
                    placeholder="CA"
                  />
                  {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                </div>
              </div>
              <div>
                <label htmlFor="zipCode" className="label">ZIP Code</label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={shippingInfo.zipCode}
                  onChange={handleShippingChange}
                  className="input"
                  placeholder="12345"
                />
                {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
              </div>
              <div>
                <label htmlFor="email" className="label">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={shippingInfo.email}
                  onChange={handleShippingChange}
                  className="input"
                  placeholder="john@example.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="phone" className="label">Phone (optional)</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={shippingInfo.phone}
                  onChange={handleShippingChange}
                  className="input"
                  placeholder="(123) 456-7890"
                />
              </div>
              <div className="flex justify-between pt-4">
                <button 
                  type="button"
                  className="btn-outline"
                  onClick={prevStep}
                >
                  Back to Cart
                </button>
                <button 
                  type="button"
                  className="btn-primary"
                  onClick={nextStep}
                >
                  Continue to Payment
                </button>
              </div>
            </form>
          </div>
        );
      
      case 3:
        return (
          <div className="bg-white dark:bg-surface-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Payment Information</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="cardNumber" className="label">Card Number</label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={paymentInfo.cardNumber}
                  onChange={handlePaymentChange}
                  className="input"
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                />
                {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
              </div>
              <div>
                <label htmlFor="cardHolder" className="label">Card Holder Name</label>
                <input
                  type="text"
                  id="cardHolder"
                  name="cardHolder"
                  value={paymentInfo.cardHolder}
                  onChange={handlePaymentChange}
                  className="input"
                  placeholder="John Doe"
                />
                {errors.cardHolder && <p className="text-red-500 text-sm mt-1">{errors.cardHolder}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="expiryDate" className="label">Expiry Date</label>
                  <input
                    type="text"
                    id="expiryDate"
                    name="expiryDate"
                    value={paymentInfo.expiryDate}
                    onChange={handlePaymentChange}
                    className="input"
                    placeholder="MM/YY"
                    maxLength="5"
                  />
                  {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>}
                </div>
                <div>
                  <label htmlFor="cvv" className="label">CVV</label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    value={paymentInfo.cvv}
                    onChange={handlePaymentChange}
                    className="input"
                    placeholder="123"
                    maxLength="4"
                  />
                  {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-surface-200 dark:border-surface-700">
                <div className="flex justify-between mb-4">
                  <span className="font-semibold">Total Amount:</span>
                  <span className="text-lg font-bold">${cartAmount.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex justify-between">
                <button 
                  type="button"
                  className="btn-outline"
                  onClick={prevStep}
                >
                  Back to Shipping
                </button>
                <button 
                  type="button"
                  className={`btn-primary flex items-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  onClick={nextStep}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Place Order'
                  )}
                </button>
              </div>
            </form>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      
      {/* Checkout Steps Indicator */}
      <div className="flex mb-8">
        {['Cart Review', 'Shipping', 'Payment'].map((stepName, index) => (
          <div key={index} className="flex-1">
            <div className={`flex items-center ${index > 0 ? 'ml-2' : ''}`}>
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                  step > index + 1 ? 'bg-green-500 text-white' : 
                  step === index + 1 ? 'bg-primary text-white' : 
                  'bg-surface-200 dark:bg-surface-700 text-surface-600 dark:text-surface-400'
                }`}
              >
                {step > index + 1 ? (
                  (() => {
                    const CheckIcon = getIcon('check');
                    return <CheckIcon className="w-5 h-5" />;
                  })()
                ) : (
                  index + 1
                )}
              </div>
              {index < 2 && (
                <div 
                  className={`flex-1 h-1 mx-2 ${
                    step > index + 1 ? 'bg-green-500' : 'bg-surface-200 dark:bg-surface-700'
                  }`}
                ></div>
              )}
            </div>
            <div className={`mt-2 text-sm text-center ${
              step === index + 1 ? 'text-primary font-medium' : 
              step > index + 1 ? 'text-green-500' : 
              'text-surface-500 dark:text-surface-400'
            }`}>
              {stepName}
            </div>
          </div>
        ))}
      </div>
      
      {/* Step Content */}
      {renderStepContent()}
    </div>
  );
};

export default Checkout;