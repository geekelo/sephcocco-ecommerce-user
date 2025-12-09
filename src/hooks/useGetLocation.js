import { useQuery } from "@tanstack/react-query";
import { getLocations } from "../services/getLocation";

export const useGetLocation = () => {
  return useQuery({
    queryKey: ['delivery-locations'],
    queryFn: () => getLocations(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};