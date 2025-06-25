import { apiClient } from "./axios";

export const deleteOrder = async (active_outlet,orderId) => {
  try {
    const data = await apiClient().delete(`/api/v1/${active_outlet}/sephcocco_${active_outlet}_orders/${orderId}`);
    return data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
