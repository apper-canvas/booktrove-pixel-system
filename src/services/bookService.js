/**
 * Book Service - Handles all book-related operations with the Apper backend
 */

// Get books with optional filtering, pagination, etc.
export const getBooks = async (filters = {}, page = 1, pageSize = 20) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Setup query parameters
    const params = {
      fields: [
        "Id",
        "Name",
        "Tags",
        "title",
        "author",
        "description",
        "price",
        "cover",
        "rating",
        "genre",
        "condition",
        "publishDate",
        "publisher",
        "pages",
        "isbn",
        "language"
      ],
      pagingInfo: {
        limit: pageSize,
        offset: (page - 1) * pageSize
      }
    };

    // Add filters if provided
    if (filters.genre && filters.genre !== 'all') {
      params.where = [
        {
          fieldName: "genre",
          operator: "ExactMatch",
          values: [filters.genre]
        }
      ];
    }

    // Add search query if provided
    if (filters.searchQuery) {
      if (!params.whereGroups) {
        params.whereGroups = [];
      }
      
      params.whereGroups.push({
        operator: "OR",
        subGroups: [
          {
            conditions: [
              {
                fieldName: "title",
                operator: "Contains",
                values: [filters.searchQuery]
              }
            ]
          },
          {
            conditions: [
              {
                fieldName: "author",
                operator: "Contains",
                values: [filters.searchQuery]
              }
            ]
          }
        ]
      });
    }

    // Add sorting if needed
    if (filters.sort) {
      params.orderBy = [];
      
      switch (filters.sort) {
        case 'price-low':
          params.orderBy.push({ fieldName: "price", SortType: "ASC" });
          break;
        case 'price-high':
          params.orderBy.push({ fieldName: "price", SortType: "DESC" });
          break;
        case 'rating':
          params.orderBy.push({ fieldName: "rating", SortType: "DESC" });
          break;
        default:
          // Default sorting (featured) - could be by CreatedOn descending
          params.orderBy.push({ fieldName: "CreatedOn", SortType: "DESC" });
      }
    }

    const response = await apperClient.fetchRecords("book", params);
    return response.data;
  } catch (error) {
    console.error("Error fetching books:", error);
    throw error;
  } 
};

// Get a single book by ID
export const getBookById = async (bookId) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const response = await apperClient.getRecordById("book", bookId);
    return response.data;
  } catch (error) {
    console.error(`Error fetching book with ID ${bookId}:`, error);
    throw error;
  }
};

// Get featured books for homepage
export const getFeaturedBooks = async (limit = 8) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Setup query parameters to get books with highest ratings
    const params = {
      fields: [
        "Id",
        "Name",
        "Tags",
        "title",
        "author",
        "description",
        "price",
        "cover",
        "rating",
        "genre",
        "condition",
        "publishDate",
        "publisher",
        "pages",
        "isbn",
        "language"
      ],
      orderBy: [
        { 
          fieldName: "rating", 
          SortType: "DESC" 
        }
      ],
      pagingInfo: {
        limit: limit,
        offset: 0
      }
    };

    const response = await apperClient.fetchRecords("book", params);
    
    // Handle the case where no data is returned
    if (!response || !response.data) {
      return [];
    }
    
    return response.data;
  } catch (error) {
    console.error("Error fetching featured books:", error);
    // Return empty array instead of throwing to prevent UI crashes
    return [];
  }
};