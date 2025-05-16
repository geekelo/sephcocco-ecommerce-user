export const getBorderColorClass = (status) => {
  switch (status) {
    case 'Processing Order':
      return 'border-processing';
    case 'Processing Payment':
      return 'border-payment';
    case 'Awaiting Payment Confirmation':
      return 'border-awaiting';
    case "Delivering":
      return "border-delivering";
    case "Shipped":
      return "border-shipped";
    case "Out for Delivery":
      return "border-out-delivery";
    default:
      return "border-default";
  }
};
