
import { useMutation } from "@tanstack/react-query";


import { updateOrder } from "../services/updateOrder";


export const useUpdateOrder = () => {
 
    return useMutation({
      mutationFn: async ({active_outlet,orderId,payload}) => {
        const response = await updateOrder(active_outlet,orderId,payload); 
        return response
      }
    });
  };
  