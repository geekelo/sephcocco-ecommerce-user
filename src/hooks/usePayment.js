
import { useMutation } from "@tanstack/react-query";

import { payment } from "../services/payment";


export const usePayment = () => {
 
    return useMutation({
      mutationFn: async ({active_outlet,payload}) => {
        const response = await payment(active_outlet,payload); 
        return response
      }
    });
  };
  