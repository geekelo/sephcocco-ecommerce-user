export const getBorderColorClass = (status) => {
  // Normalize status to handle case variations
  const normalizedStatus = status?.toLowerCase();
  
  switch (normalizedStatus) {
    case 'processing order':
      return 'border-processing';
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
    case "delivered":
      return "border-completed";
    default:
      return "border-default";
  }
};
