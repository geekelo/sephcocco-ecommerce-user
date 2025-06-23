import { apiClient } from "./axios";

export const likedProduct = async (active_outlet,productId ) => {
  try {
    const data = await apiClient().post(`/api/v1/${active_outlet}/sephcocco_${active_outlet}_products/${productId}/like?id=${productId}`);
    return data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
