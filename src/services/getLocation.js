import { apiClient } from "./axios";

export const getLocations = async () => {
  try {
        
 
    const data = await apiClient().get(`/api/v1/sephcocco_locations`);
    return data.data.locations;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
