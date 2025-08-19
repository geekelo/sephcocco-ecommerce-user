
import { useMutation } from "@tanstack/react-query";

import { paymentVerify } from "../services/paymentVerify";


export const usePaymentVerify = () => {
 
    return useMutation({
      mutationFn: async ({active_outlet,payload}) => {
        const response = await paymentVerify(active_outlet,payload); 
        return response
      }
    });
  };
  