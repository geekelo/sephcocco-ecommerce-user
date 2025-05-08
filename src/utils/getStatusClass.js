export const getStatusClass = (status) => {
    switch (status) {
      case 'Delivering':
        return 'status-badge-delivering';
      case 'Processing Order':
        return 'status-badge-processing-order';
      case 'Processing Payment':
        return 'status-badge-processing-payment';
      case 'Arrived':
        return 'status-badge-arrived';
      case 'Awaiting Payment Confirmation':
        return 'status-badge-awaiting-payment';
      case 'Completed':
        return 'status-badge-completed';
      default:
        return 'status-badge-default';
    }
  };
