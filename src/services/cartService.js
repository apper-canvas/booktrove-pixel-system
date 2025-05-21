/**
 * Cart Service - Handles all cart-related operations with the Apper backend
 */

// Get cart items for a specific user
export const getCartItems = async (userId) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      fields: ["Id", "Name", "book", "quantity", "user"],
      expands: [
        {
          name: "book",
          fields: ["Id", "title", "author", "price", "cover", "description"]
        }
      ],
      where: [
        {
          fieldName: "user",
          operator: "ExactMatch",
          values: [userId]
        }
      ]
    };

    const response = await apperClient.fetchRecords("cart_item", params);
    return response.data;
  } catch (error) {
    console.error("Error fetching cart items:", error);
    throw error;
  }
};

// Add item to cart
export const addToCart = async (userId, bookId, quantity = 1) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // First check if item already exists in cart
    const params = {
      fields: ["Id", "quantity"],
      where: [
        { fieldName: "user", operator: "ExactMatch", values: [userId] },
        { fieldName: "book", operator: "ExactMatch", values: [bookId] }
      ]
    };

    const existing = await apperClient.fetchRecords("cart_item", params);
    
    if (existing.data && existing.data.length > 0) {
      // Item exists, update quantity
      const item = existing.data[0];
      const newQuantity = item.quantity + quantity;
      
      const updateParams = {
        records: [{
          Id: item.Id,
          quantity: newQuantity
        }]
      };
      
      await apperClient.updateRecord("cart_item", updateParams);
      return { success: true, message: "Item quantity updated in cart" };
    } else {
      // Item doesn't exist, add new item
      const createParams = {
        records: [{
          Name: `Cart item - ${bookId}`,
          book: bookId,
          user: userId,
          quantity: quantity
        }]
      };
      
      await apperClient.createRecord("cart_item", createParams);
      return { success: true, message: "Item added to cart" };
    }
  } catch (error) {
    console.error("Error adding item to cart:", error);
    throw error;
  }
};

// Remove item from cart
export const removeFromCart = async (cartItemId) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = { RecordIds: [cartItemId] };
    await apperClient.deleteRecord("cart_item", params);
    return { success: true, message: "Item removed from cart" };
  } catch (error) {
    console.error("Error removing item from cart:", error);
    throw error;
  }
};

// Update item quantity in cart
export const updateCartItemQuantity = async (cartItemId, quantity) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      records: [{
        Id: cartItemId,
        quantity: quantity
      }]
    };
    
    await apperClient.updateRecord("cart_item", params);
    return { success: true, message: "Cart item quantity updated" };
  } catch (error) {
    console.error("Error updating cart item quantity:", error);
    throw error;
  }
};