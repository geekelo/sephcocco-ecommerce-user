
import { useMutation } from "@tanstack/react-query";
import { deleteOrder } from "../services/deleteOrder";


export const useDeleteOrder = () => {
 
    return useMutation({
      mutationFn: async ({active_outlet, orderId}) => {
        const response = await deleteOrder(active_outlet,orderId); 
        return response
      }
    });
  };
  