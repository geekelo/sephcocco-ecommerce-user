
import { useMutation } from "@tanstack/react-query";
import { likedProduct } from "../services/likedProduct";

export const useLikedProduct = () => {
 
    return useMutation({
      mutationFn: async ({active_outlet,productId}) => {
        const response = await likedProduct(active_outlet,productId); 
        return response
      }
    });
  };
  