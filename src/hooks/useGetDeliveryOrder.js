import { useQuery } from "@tanstack/react-query";
import { getDeliveryOrder } from "../services/getDeliveryOrder";

export const useGetDeliveryOrder = (active_outlet,page,per_page) => {
  return useQuery({
    queryKey: ['delivery-orders', active_outlet,page,per_page],
    queryFn: () => getDeliveryOrder(active_outlet,page,per_page),
    enabled: !!active_outlet, // Only run query if active_outlet is available
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (updated from cacheTime)
    keepPreviousData: true, // Keep previous data while loading new page
  });
};