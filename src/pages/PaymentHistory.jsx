
import React from 'react';
import { MobilePaymentHistoryCard } from '../components/MobilePaymentHistory';
import { DesktopPaymentHistoryTable } from '../components/DesktopPaymentHistory';
import { payments } from '../constants/payments';
import '../styles/PaymentHistory.css'

 const PaymentHistory = () => {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <div className='payment-history'>
    <h1 className='payment-history-title'>Payment history</h1>
    {
    isMobile
    ? <MobilePaymentHistoryCard payments={payments} />
    : <DesktopPaymentHistoryTable payments={payments} />}
    </div> ;
};

export default PaymentHistory