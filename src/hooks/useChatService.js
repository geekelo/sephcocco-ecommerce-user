import { useEffect, useState } from "react";

// Simulating a WebSocket connection
class MockWebSocket {
  constructor(url) {
    this.url = url;
    this.onmessage = null;
    this.onopen = null;
    this.onclose = null;
    this.onerror = null;
    this.readyState = 0; // CONNECTING

    // Simulate connection establishment
    setTimeout(() => {
      this.readyState = 1; // OPEN
      if (this.onopen) this.onopen({ target: this });
    }, 500);
  }

  send(data) {
    // Simulate server echo with delay
    setTimeout(() => {
      if (this.onmessage && this.readyState === 1) {
        try {
          const parsed = JSON.parse(data);
          
          // Simulate different response types
          if (parsed.type === 'MESSAGE') {
            // Simulate agent response
            setTimeout(() => {
                const response = {
                  id: `server-${Date.now()}`,
                  type: 'user',
                  text: 'How many days does it take to get my order?',
                  sender: 'Listerine Zero Delivery Enqiry',
                  timestamp: new Date()
                };
                
                this.onmessage({ 
                  data: JSON.stringify(response)
                });
              }, 1500);
          }
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      }
    }, 300);
  }

  close() {
    this.readyState = 3; // CLOSED
    if (this.onclose) this.onclose({ target: this });
  }
}



export const useChatService = () => {
    const [socket, setSocket] = useState(null);
    const [connected, setConnected] = useState(false);
    const [messages, setMessages] = useState([]);
  
    // Initialize connection
    useEffect(() => {
      const ws = new MockWebSocket('wss://example.com/chat');
      
      ws.onopen = () => {
        console.log('Connected to chat server');
        setConnected(true);
      };
      
      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          
          // Ensure timestamp is a Date object
          if (message.timestamp && !(message.timestamp instanceof Date)) {
            message.timestamp = new Date(message.timestamp);
          }
          
          setMessages(prev => [...prev, message]);
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      };
      
      ws.onclose = () => {
        console.log('Disconnected from chat server');
        setConnected(false);
      };
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
      
      setSocket(ws);
      
      // Clean up on unmount
      return () => {
        if (ws && ws.readyState === 1) {
          ws.close();
        }
      };
    }, []);
  
    // Send a message
    const sendMessage = (message) => {
      if (socket && socket.readyState === 1) {
        const messageData = {
          type: 'MESSAGE',
          content: message,
          timestamp: new Date().toISOString()
        };
        
        // Add message to local state immediately
        const newMessage = {
          id: `client-${Date.now()}`,
          type: 'agent',
          text: message,
          sender: 'Support Agent',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, newMessage]);
        
        // Send to server
        socket.send(JSON.stringify(messageData));
      }
    };
  
    // Load chat history
    useEffect(() => {
      // Simulate loading chat history
      const history = [
        {
          id: 1,
          type: 'user',
          text: 'Hello! I made payment for the last order but haven\'t received confirmation.',
          sender: 'Listerine Zero Delivery Enqiry',
          timestamp: new Date(Date.now() - 3600000).toISOString() // Use string format
        },
        {
          id: 2,
          type: 'user',
          text: 'Hello! I made payment for the last order but haven\'t received confirmation.',
          sender: 'Listerine Zero Delivery Enqiry',
          timestamp: new Date(Date.now() - 2400000).toISOString() // Use string format
        },
        {
          id: 3,
          type: 'user',
          text: 'Hello! I made payment for the last order but haven\'t received confirmation.',
          sender: 'Listerine Zero Delivery Enqiry',
          timestamp: new Date(Date.now() - 1200000).toISOString() // Use string format
        }
      ];
      
      setMessages(history);
    }, []);
  
    return {
      connected,
      messages,
      sendMessage
    };
  };