
import { useMutation } from "@tanstack/react-query";
import { unlikedProduct } from "../services/unlikedProduct";

export const useUnlikedProduct = () => {
 
    return useMutation({
      mutationFn: async ({active_outlet,productId}) => {
        const response = await unlikedProduct(active_outlet,productId); 
        return response
      }
    });
  };
  