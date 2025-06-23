import { apiClient } from "./axios";

export const unlikedProduct = async (active_outlet,productId ) => {
  try {
    const data = await apiClient().post(`/api/v1/${active_outlet}/sephcocco_${active_outlet}_products/${productId}/unlike?id=${productId}`);
    return data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
