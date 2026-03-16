import { useQuery } from "@tanstack/react-query";
import { getAllProduct } from "../services/getAllProduct";

export const useViewAllProduct = (active_outlet,filter = {}, page = 1, per_page = 20, userId) => {
  return useQuery({
    queryKey: ['view-products', active_outlet,filter, page, per_page,userId],
    queryFn: () => getAllProduct(active_outlet, filter,page, per_page,userId),
    enabled: !!active_outlet, // Only run query if active_outlet is available
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (updated from cacheTime)
    keepPreviousData: true, // Keep previous data while loading new page
  });
};