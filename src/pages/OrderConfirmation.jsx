import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getIcon } from '../utils/iconUtils';

const OrderConfirmation = () => {
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Retrieve order details from session storage
    const lastOrder = sessionStorage.getItem('lastOrder');
    
    if (lastOrder) {
      setOrder(JSON.parse(lastOrder));
    } else {
      // If no order found, redirect to home
      navigate('/');
    }
  }, [navigate]);
  
  if (!order) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white dark:bg-surface-800 p-8 rounded-lg shadow-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
            {(() => {
              const CheckIcon = getIcon('check');
              return <CheckIcon className="w-8 h-8 text-green-600 dark:text-green-400" />;
            })()}
          </div>
          <h1 className="text-2xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-surface-600 dark:text-surface-400 text-center">
            Thank you for your order. We've received your purchase and are processing it now.
          </p>
        </div>
        
        <div className="border-b border-surface-200 dark:border-surface-700 pb-4 mb-4">
          <div className="flex justify-between mb-2">
            <span className="font-medium">Order Number:</span>
            <span className="font-bold">{order.orderNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Date:</span>
            <span>{formatDate(order.date)}</span>
          </div>
        </div>
        
        <h2 className="text-lg font-bold mb-3">Order Summary</h2>
        <div className="space-y-3 mb-6">
          {order.items.map(item => (
            <div key={item.id} className="flex justify-between border-b border-surface-200 dark:border-surface-700 pb-3">
              <div className="flex">
                <img src={item.cover} alt={item.title} className="w-12 h-16 object-cover rounded-md mr-3" />
                <div>
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-sm text-surface-500 dark:text-surface-400">Qty: {item.quantity}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-between border-t border-surface-200 dark:border-surface-700 pt-4 mb-8">
          <span className="text-lg font-bold">Total:</span>
          <span className="text-lg font-bold">${order.total.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-center">
          <Link to="/browse" className="btn-primary">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;