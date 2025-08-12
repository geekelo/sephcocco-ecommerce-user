import { apiClient } from "./axios";

export const getAllProduct = async (active_outlet, page = 1, per_page = 20, userId = null) => {
  try {
    console.log('🔍 getAllProduct called with:', { active_outlet, page, per_page, userId });
    const data = await apiClient().get(`/api/v1/${active_outlet}/sephcocco_${active_outlet}_products?user_id=${userId}`, {
      params: {
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