export const getStatusClass = (status) => {
    switch (status) {
      case 'delivering':
        return 'status-badge-delivering';
      case 'pending':
        return 'status-badge-processing-order';
      case 'paid':
        return 'status-badge-processing-payment';
      case 'Arrived':
        return 'status-badge-arrived';
      case 'awaiting payment approval':
        return 'status-badge-awaiting-payment';
      case 'completed':
        return 'status-badge-completed';
      default:
        return 'status-badge-default';
    }
  };
