
import { useMutation } from "@tanstack/react-query";

import { createOrder } from "../services/createOrder";


export const useCreateOrder = () => {
 
    return useMutation({
      mutationFn: async ({active_outlet,payload}) => {
        const response = await createOrder(active_outlet,payload); 
        return response
      }
    });
  };
  