import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import { 
  selectCartItems, 
  selectCartAmount, 
  selectCartTotal, 
  updateQuantity, 
  removeFromCart, 
  clearCart 
} from '../store/cartSlice';

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const cartAmount = useSelector(selectCartAmount);
  const cartItemCount = useSelector(selectCartTotal);

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity >= 1) {
      dispatch(updateQuantity({ id, quantity: newQuantity }));
      toast.info('Cart updated');
    }
  };

  const handleRemoveItem = (id, title) => {
    dispatch(removeFromCart(id));
    toast.error(`${title} removed from cart`);
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    toast.info('Cart has been cleared');
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-surface-800 rounded-xl shadow">
          {(() => {
            const ShoppingBagIcon = getIcon('shopping-bag');
            return <ShoppingBagIcon className="w-24 h-24 text-surface-300 mx-auto mb-6" />;
          })()}
          <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
          <p className="text-surface-500 dark:text-surface-400 mb-6">
            Looks like you haven't added any books to your cart yet.
          </p>
          <button 
            onClick={() => navigate('/browse')}
            className="btn-primary"
          >
            Browse Books
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-surface-800 rounded-xl shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Cart Items ({cartItemCount})</h2>
              
              {cartItems.map(item => (
                <div key={item.id} className="flex border-b border-surface-200 dark:border-surface-700 py-6 last:border-0">
                  <img src={item.cover} alt={item.title} className="w-24 h-36 object-cover rounded-md mr-4" />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-lg text-surface-800 dark:text-surface-100">{item.title}</h3>
                      <button 
                        onClick={() => handleRemoveItem(item.id, item.title)}
                        className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 rounded-full"
                        aria-label={`Remove ${item.title} from cart`}
                      >
                        {(() => { const TrashIcon = getIcon('trash-2'); return <TrashIcon className="w-5 h-5" />; })()}
                      </button>
                    </div>
                    <p className="text-sm text-surface-500 dark:text-surface-400">{item.author}</p>
                    <p className="text-accent font-medium mt-2">${item.price.toFixed(2)}</p>
                    
                    <div className="flex items-center mt-4">
                      <span className="text-sm text-surface-600 dark:text-surface-400 mr-3">Quantity:</span>
                      <button 
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="p-1 rounded-md bg-surface-100 dark:bg-surface-700"
                        aria-label="Decrease quantity"
                      >
                        {(() => { const MinusIcon = getIcon('minus'); return <MinusIcon className="w-4 h-4" />; })()}
                      </button>
                      <span className="mx-3 w-8 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="p-1 rounded-md bg-surface-100 dark:bg-surface-700"
                        aria-label="Increase quantity"
                      >
                        {(() => { const PlusIcon = getIcon('plus'); return <PlusIcon className="w-4 h-4" />; })()}
                      </button>
                      <p className="ml-auto font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-surface-800 rounded-xl shadow p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="border-b border-surface-200 dark:border-surface-700 pb-4 mb-4">
                <div className="flex justify-between text-lg mb-2">
                  <span>Subtotal ({cartItemCount} items):</span>
                  <span className="font-bold">${cartAmount.toFixed(2)}</span>
                </div>
              </div>
              <button className="btn-primary w-full mb-3" onClick={handleCheckout}>Proceed to Checkout</button>
              <button className="btn-outline w-full" onClick={handleClearCart}>Clear Cart</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;