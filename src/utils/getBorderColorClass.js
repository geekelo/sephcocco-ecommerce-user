export const getBorderColorClass = (status) => {
  // Normalize status to handle case variations
  const normalizedStatus = status?.toLowerCase();
  
  switch (normalizedStatus) {
    case 'paid':
      return 'border-processing';
    case 'payment confirmed':
      return 'border-payment-confirmed';
    case 'processing payment':
      return 'border-payment';
    case 'awaiting payment confirmation':
      return 'border-awaiting';
    case "delivering":
      return "border-delivering";
    case "in transit":
      return "border-in-transit";
    case "out for delivery":
      return "border-out-delivery";
    case "completed":
      return "border-completed";
    case "delivered":
      return "border-completed";
    default:
      return "border-default";
  }
};
