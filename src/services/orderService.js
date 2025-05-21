/**
 * Order Service - Handles all order-related operations with the Apper backend
 */

// Create a new order
export const createOrder = async (orderData, cartItems) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Create the order record
    const orderParams = {
      records: [{
        Name: `Order ${orderData.orderNumber}`,
        orderNumber: orderData.orderNumber,
        date: new Date().toISOString(),
        total: orderData.total,
        status: "pending"
      }]
    };

    const orderResponse = await apperClient.createRecord("order", orderParams);
    const orderId = orderResponse.results[0].data.Id;

    // Create shipping information
    const shippingParams = {
      records: [{
        Name: `Shipping for Order ${orderData.orderNumber}`,
        fullName: orderData.shipping.fullName,
        address: orderData.shipping.address,
        city: orderData.shipping.city,
        state: orderData.shipping.state,
        zipCode: orderData.shipping.zipCode,
        email: orderData.shipping.email,
        phone: orderData.shipping.phone || "",
        order: orderId
      }]
    };

    await apperClient.createRecord("shipping_info", shippingParams);

    // Create payment information
    const paymentParams = {
      records: [{
        Name: `Payment for Order ${orderData.orderNumber}`,
        cardHolder: orderData.payment.cardHolder,
        cardNumberLast4: orderData.payment.cardNumber.slice(-4),
        expiryDate: orderData.payment.expiryDate,
        order: orderId
      }]
    };

    await apperClient.createRecord("payment_info", paymentParams);

    // Create order items
    const orderItemRecords = cartItems.map(item => ({
      Name: `Item in Order ${orderData.orderNumber}`,
      quantity: item.quantity,
      price: item.price,
      order: orderId,
      book: item.id
    }));

    const orderItemsParams = {
      records: orderItemRecords
    };

    await apperClient.createRecord("order_item", orderItemsParams);

    // Clear cart items after successful order creation
    // This would be handled by the cart service

    return {
      success: true,
      orderId: orderId,
      orderNumber: orderData.orderNumber
    };
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

// Get order details by ID
export const getOrderById = async (orderId) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Get order details
    const orderResponse = await apperClient.getRecordById("order", orderId);
    const order = orderResponse.data;

    // Get order items
    const orderItemsParams = {
      fields: ["Id", "quantity", "price", "book"],
      expands: [
        {
          name: "book",
          fields: ["Id", "title", "author", "cover", "price"]
        }
      ],
      where: [
        {
          fieldName: "order",
          operator: "ExactMatch",
          values: [orderId]
        }
      ]
    };

    const itemsResponse = await apperClient.fetchRecords("order_item", orderItemsParams);
    
    // Get shipping info
    const shippingParams = {
      fields: ["Id", "fullName", "address", "city", "state", "zipCode", "email", "phone"],
      where: [{ fieldName: "order", operator: "ExactMatch", values: [orderId] }]
    };
    
    const shippingResponse = await apperClient.fetchRecords("shipping_info", shippingParams);

    return {
      ...order,
      items: itemsResponse.data,
      shipping: shippingResponse.data[0]
    };
  } catch (error) {
    console.error(`Error fetching order with ID ${orderId}:`, error);
    throw error;
  }
};