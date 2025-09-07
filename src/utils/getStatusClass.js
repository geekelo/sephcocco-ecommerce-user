export const getStatusClass = (status) => {
    // Normalize status to lowercase for comparison
    const normalizedStatus = status?.toLowerCase();
    
    switch (normalizedStatus) {
      case 'delivering':
        return 'status-badge-delivering';
      case 'pending':
        return 'status-badge-processing-order';
      case 'paid':
          return 'status-badge-processing-payment';
      case 'in transit':
        return 'status-badge-in-transit';
      case 'awaiting payment approval':
        return 'status-badge-awaiting-payment';
      case 'completed':
      case 'delivered':
        return 'status-badge-completed';
      default:
        return 'status-badge-default';
    }
  };
