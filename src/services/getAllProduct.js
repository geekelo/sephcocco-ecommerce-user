import { apiClient } from "./axios";

export const getAllProduct = async (active_outlet,filters, page = 1, per_page = 20, userId = null) => {


 
  try {
        const filter = {};

    if (filters.search_terms) filter.search_terms = filters.search_terms.trim();
    if (filters.category_id) filter.category_id = filters.category_id;
     if (filters.sort_by_likes) filter.sort_by_likes = filters.sort_by_likes;
    if (filters.start_price) filter.start_price = filters.start_price;
    if (filters.end_price) filter.end_price = filters.end_price;
 
    console.log('🔍 getAllProduct called with:', { active_outlet, page, per_page, userId });
    const data = await apiClient().get(`/api/v1/${active_outlet}/sephcocco_${active_outlet}_products?user_id=${userId}`, {
      params: {
        filter,
        page,
        per_page,
        include: 'categories' // Only include necessary associations
      }
    });
    console.log('✅ getAllProduct response:', data.data);
    return data.data;
  } catch (err) {
    console.error('❌ Error fetching products:', err);
    throw err;
  }
};