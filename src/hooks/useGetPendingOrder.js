import { useQuery } from "@tanstack/react-query";
import {  getPendingOrder } from "../services/getPendingOrders";

export const useGetPendingOrder = (active_outlet) => {
  return useQuery({
    queryKey: ['pending-orders', active_outlet],
    queryFn: () => getPendingOrder(active_outlet),
    enabled: !!active_outlet, // Only run query if active_outlet is available
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (updated from cacheTime)
    keepPreviousData: true, // Keep previous data while loading new page
  });
};