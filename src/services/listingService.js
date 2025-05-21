/**
 * Listing Service - Handles all book listing operations with the Apper backend
 */

// Create a new book listing
export const createListing = async (listingData, userId) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Only include updateable fields
    const params = {
      records: [{
        Name: listingData.title,
        title: listingData.title,
        author: listingData.author,
        description: listingData.description,
        genre: listingData.genre,
        condition: listingData.condition,
        price: parseFloat(listingData.price),
        coverImage: listingData.coverImageUrl, // This would be a URL after image upload
        status: "pending", // Default status for new listings
        seller: userId // Link to the seller's user ID
      }]
    };

    const response = await apperClient.createRecord("book_listing", params);
    return {
      success: true,
      listingId: response.results[0].data.Id,
      message: "Listing created successfully and is pending review"
    };
  } catch (error) {
    console.error("Error creating book listing:", error);
    throw error;
  }
};

// Get user's listings
export const getUserListings = async (userId) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      fields: ["Id", "Name", "title", "author", "description", "genre", "condition", "price", "coverImage", "status"],
      where: [
        {
          fieldName: "seller",
          operator: "ExactMatch",
          values: [userId]
        }
      ]
    };

    const response = await apperClient.fetchRecords("book_listing", params);
    return response.data;
  } catch (error) {
    console.error("Error fetching user listings:", error);
    throw error;
  }
};