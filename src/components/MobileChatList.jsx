
import React from 'react';
import { MessageCircle } from 'lucide-react';
import '../styles/MobileChatList.css';
import Image from '../assets/image.png'
const MobileChatList = ({ onChatClick }) => {
  // Sample chat orders
  const chatOrders = [
    {
      id: 1,
      title: 'Listerine Zero Delivery Enquiry',
      description: 'Hello i made payment for the list.............'
    },
    {
      id: 2,
      title: 'Listerine Zero Delivery Enquiry',
      description: 'Hello i made payment for the list.............'
    },
    {
      id: 3,
      title: 'Listerine Zero Delivery Enquiry',
      description: 'Hello i made payment for the list.............'
    }
  ];
  
  return (
    <div className="mobile-chat-list">
      <div className="support-chat-button">
        <button className="chat-with-support">
          <MessageCircle size={16} />
          <span>Chat with support now</span>
        </button>
      </div>
      
      <div className="chat-orders">
        {chatOrders.map((order, index) => (
          <div 
            key={order.id} 
            className={`chat-order-item ${index % 2 === 1 ? 'highlighted' : ''}`}
            onClick={() => onChatClick(order)}
          >
            <div className="order-avatar">
              <img src={Image} alt="Product" />
            </div>
            <div className="order-details">
              <h3>{order.title}</h3>
              <p>{order.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileChatList;