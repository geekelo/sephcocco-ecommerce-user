import { createConsumer } from '@rails/actioncable';
import { useGetMessages } from './useGetMessages';
import { useState, useRef, useEffect, useCallback } from 'react';

export const useMessaging = (authToken, outletType = '', options = {}) => {
  const {
    autoLoadHistory = true,
    messageId = null,
    productId = null,
    initialStatus = 'open'
  } = options;

  // WebSocket state
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const subscriptionRef = useRef(null);
  const consumerRef = useRef(null);
  const connectionAttemptedRef = useRef(false);
  const currentUserIdRef = useRef(null);

  // Get messages hook for REST API
  const {
    messages: apiMessages,
    loading: apiLoading,
    error: apiError,
    meta,
    getMessages,
    getMessageHistory,
    getProductMessages,
    getAllMessages,
    loadMoreMessages,
    setMessages: setApiMessages
  } = useGetMessages(authToken, outletType);

  // Combined messages state (API + WebSocket)
  const [realTimeMessages, setRealTimeMessages] = useState([]);
  const [allMessages, setAllMessages] = useState([]);

  // Get current user ID from localStorage or token
  useEffect(() => {
    // Try to get user ID from localStorage first
    const userId = localStorage.getItem('userId') || localStorage.getItem('user_id');
    if (userId) {
      currentUserIdRef.current = userId;
      console.log('👤 Current user ID:', userId);
    }
  }, []);

  // Load initial message history
  useEffect(() => {
    if (autoLoadHistory && authToken && outletType) {
      if (messageId) {
        getMessageHistory(messageId);
      } else if (productId) {
        getProductMessages(productId);
      } else {
        getAllMessages(initialStatus);
      }
    }
  }, [authToken, outletType, messageId, productId, autoLoadHistory, initialStatus]);

  // Combine API messages with real-time messages
  useEffect(() => {
    const combined = [...apiMessages, ...realTimeMessages];
    // Remove duplicates based on ID
    const uniqueMessages = combined.filter((message, index, self) => 
      index === self.findIndex(m => m.id === message.id)
    );
    setAllMessages(uniqueMessages);
  }, [apiMessages, realTimeMessages]);

  // WebSocket connection
  useEffect(() => {
    if (!authToken) {
      setConnectionError('No authentication token provided');
      return;
    }

    // Prevent multiple connection attempts
    if (connectionAttemptedRef.current || isConnecting || isConnected) {
      return;
    }

    connectionAttemptedRef.current = true;
    setIsConnecting(true);
    setConnectionError(null);

    console.log('🔐 User connecting to WebSocket...');
    console.log('📝 Token (first 20 chars):', authToken.substring(0, 20) + '...');
    console.log('🏪 Outlet type:', outletType);
    console.log('👤 Current user ID:', currentUserIdRef.current);

    try {
      // Create Action Cable consumer with token as query parameter
      consumerRef.current = createConsumer(`wss://sephcocco-lounge-api.onrender.com/cable?token=${encodeURIComponent(authToken)}`);

      console.log('✅ Consumer created, attempting to subscribe...');

      // Subscribe to messaging channel - USER CHANNEL
      subscriptionRef.current = consumerRef.current.subscriptions.create(
        {
          channel: "MessagingChannel",
          outlet_type: outletType
        },
        {
          connected() {
            setIsConnected(true);
            setIsConnecting(false);
            setConnectionError(null);
            console.log('🎉 User successfully connected to messaging channel');
            console.log('📡 User channel: messaging_user_' + currentUserIdRef.current);
            console.log('🏪 Outlet type:', outletType);
            
            // Send a ping to test connection
            setTimeout(() => {
              if (subscriptionRef.current) {
                console.log('🏓 Sending ping to test connection...');
                subscriptionRef.current.send({ type: 'ping', timestamp: Date.now() });
              }
            }, 1000);
          },

          disconnected() {
            setIsConnected(false);
            setIsConnecting(false);
            connectionAttemptedRef.current = false;
            console.log('💔 User disconnected from messaging channel');
          },

          rejected() {
            setIsConnected(false);
            setIsConnecting(false);
            connectionAttemptedRef.current = false;
            setConnectionError('Failed to connect to messaging channel - authentication may have failed');
            console.log('❌ User failed to connect to messaging channel - subscription rejected');
          },

          received(data) {
            console.log('📨 User received WebSocket message:', data);
            console.log('📨 Message type:', data.type);
            console.log('📨 Full message data:', JSON.stringify(data, null, 2));

            // Handle ping response
            if (data.type === 'pong') {
              console.log('🏓 Pong response received - connection is working!');
              return;
            }

            // Handle test responses
            if (data.type === 'test_response') {
              console.log('🧪 Test response received:', data);
              return;
            }

            // Handle ALL types of new messages
            if (data.type === 'new_message' || data.type === 'broadcast_message' || data.type === 'message_broadcast') {
              console.log('🚨 REAL-TIME: User received new message!');
              console.log('💬 Message content:', data.content);
              console.log('💬 Sender ID:', data.sender_id || data.user_id);
              console.log('💬 Thread owner ID:', data.thread_owner_id || data.user_id);
              console.log('💬 Current user ID:', currentUserIdRef.current);

              // Create standardized message object
              const currentTimestamp = data.created_at || data.timestamp || new Date().toISOString();
              const standardizedMessage = {
                id: data.id || data.chat_id || `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                content: data.content,
                message_type: data.message_type || 'text',
                sender_id: data.sender_id || data.user?.id,
                sender_name: data.sender?.name || data.user?.name || 'Unknown',
                sender_email: data.sender?.email || data.user?.email || '',
                sender_role: data.sender?.role || data.user?.role || data.user_role,
                thread_owner_id: data.thread_owner_id || data.user_id,
                timestamp: currentTimestamp,
                created_at: currentTimestamp,
                outlet_type: data.outlet_type || outletType,
                conversation_id: data.message_thread_id || productId || 'default',
                realTime: true, // Flag to identify real-time messages
                display_time: new Date(currentTimestamp).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false
                })
              };

              console.log('📨 Processed standardized message:', standardizedMessage);

              // Check if this message belongs to current user's conversation
              const threadOwnerId = standardizedMessage.thread_owner_id;
              const isMyConversation = !currentUserIdRef.current || 
                String(threadOwnerId) === String(currentUserIdRef.current);

              console.log('🔍 Message belongs to current user conversation:', isMyConversation);
              console.log('🔍 Thread owner ID:', threadOwnerId);
              console.log('🔍 Current user ID:', currentUserIdRef.current);

              if (isMyConversation) {
                console.log('✅ Adding real-time message to user messages!');
                setRealTimeMessages(prev => {
                  // Check for duplicates
                  const isDuplicate = prev.some(msg => msg.id === standardizedMessage.id);
                  if (isDuplicate) {
                    console.log('⚠️ Duplicate message, skipping');
                    return prev;
                  }
                  const newMessages = [...prev, standardizedMessage];
                  console.log('✅ Real-time message added! New count:', newMessages.length);
                  return newMessages;
                });
              } else {
                console.log('⚠️ Message not for current user, ignoring');
              }
              return;
            }

            // Handle message updates
            if (data.type === 'message_updated') {
              console.log('🔄 Message updated:', data);
              // Handle message updates if needed
              return;
            }

            // Handle thread updates
            if (data.type === 'user_thread_updated') {
              console.log('🔄 Thread updated:', data);
              // Handle thread updates if needed
              return;
            }

            // Log unknown message types
            console.log('❓ Unknown message type received:', data.type);
          }
        }
      );

    } catch (err) {
      const errorMsg = 'Failed to create WebSocket connection';
      console.error('❌ Failed to create WebSocket:', err);
      setIsConnected(false);
      setIsConnecting(false);
      connectionAttemptedRef.current = false;
      setConnectionError(errorMsg);
    }

    // Cleanup on unmount
    return () => {
      console.log('🧹 Cleaning up user WebSocket subscription...');
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
      if (consumerRef.current) {
        consumerRef.current.disconnect();
        consumerRef.current = null;
      }
      setIsConnected(false);
      setIsConnecting(false);
      connectionAttemptedRef.current = false;
    };
  }, [authToken, outletType]); // Remove currentUserIdRef from dependencies

  // Function to send messages
  const sendMessage = useCallback((content, messageType = 'text', productId = null) => {
    if (subscriptionRef.current && isConnected) {
      console.log('📤 User sending message:', content);
      
      // Create optimistic message to show immediately
      const optimisticMessage = {
        id: `temp-${Date.now()}`,
        content: content,
        sender_id: currentUserIdRef.current,
        sender_name: 'You',
        sender_role: 'user',
        thread_owner_id: currentUserIdRef.current,
        message_type: messageType,
        created_at: new Date().toISOString(),
        timestamp: new Date().toISOString(),
        outlet_type: outletType,
        conversation_id: productId || 'default',
        optimistic: true, // Flag for styling
        realTime: true,
        display_time: new Date().toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        })
      };

      // Add optimistic message immediately
      setRealTimeMessages(prev => [...prev, optimisticMessage]);

      const messageData = {
        message: {
          content: content,
          outlet_type: outletType,
          message_type: messageType
        },
        outlet_type: outletType
      };

      // Add product_id if provided
      if (productId) {
        messageData.product_id = productId;
      }

      // Send message via WebSocket
      console.log('📤 Sending message via WebSocket:', messageData);
      subscriptionRef.current.perform('receive', messageData);

    } else {
      console.error('Cannot send message: not connected');
      throw new Error('WebSocket not connected');
    }
  }, [isConnected, outletType]);

  // Function to refresh messages
  const refreshMessages = useCallback(async () => {
    if (messageId) {
      return await getMessageHistory(messageId);
    } else if (productId) {
      return await getProductMessages(productId);
    } else {
      return await getAllMessages(initialStatus);
    }
  }, [messageId, productId, initialStatus, getMessageHistory, getProductMessages, getAllMessages]);

  // Function to clear real-time messages
  const clearRealTimeMessages = useCallback(() => {
    setRealTimeMessages([]);
  }, []);

  // Function to clear all messages
  const clearAllMessages = useCallback(() => {
    setRealTimeMessages([]);
    setApiMessages([]);
  }, [setApiMessages]);

  // Function to remove optimistic messages (call after successful API response)
  const removeOptimisticMessages = useCallback(() => {
    setRealTimeMessages(prev => prev.filter(msg => !msg.optimistic));
  }, []);

  return {
    // Combined state
    messages: allMessages,
    loading: apiLoading,
    error: apiError || connectionError,
    
    // WebSocket state
    isConnected,
    isConnecting,
    connectionError,
    
    // API state
    apiMessages,
    apiLoading,
    apiError,
    meta,
    
    // Real-time state
    realTimeMessages,
    
    // Functions
    sendMessage,
    refreshMessages,
    loadMoreMessages,
    clearRealTimeMessages,
    clearAllMessages,
    removeOptimisticMessages,
    
    // API functions
    getMessages,
    getMessageHistory,
    getProductMessages,
    getAllMessages,
    
    // Setters
    setMessages: setApiMessages,
    setError: setConnectionError
  };
};