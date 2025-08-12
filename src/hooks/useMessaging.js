import { useCallback, useEffect, useRef, useState } from "react";
import { createConsumer } from '@rails/actioncable';

// Utility function to get active user
export const getActiveUser = () => {
  const userData = localStorage.getItem('userData');
  if (userData) {
    try {
      return JSON.parse(userData);
    } catch (e) {
      console.error('Error parsing user data:', e);
    }
  }
  
  // Fallback to individual localStorage items
  return {
    id: localStorage.getItem('userId') || localStorage.getItem('user_id'),
    name: localStorage.getItem('userName') || localStorage.getItem('user_name'),
    email: localStorage.getItem('userEmail') || localStorage.getItem('user_email'),
    role: localStorage.getItem('userRole') || 'user'
  };
};

// Mock user data for demonstration - FIXED to match backend logs
const mockUserData = {
  id: "335b636e-9a9d-4cda-a509-49b1bd23550e", // ✅ Match backend user ID
  name: "User3 User",
  email: "user2@sephcocco.com", 
  role: "user"
};

export const useMessaging = (authToken, outletType = '', userData = mockUserData) => {
  console.log('🚀 useMessaging (User) hook called');
  console.log('🔑 Auth token:', !!authToken);
  console.log('🏪 Outlet type:', outletType);
  console.log('👤 User data:', userData);
  
  // Refs
  const authTokenRef = useRef(authToken);
  const outletTypeRef = useRef(outletType);
  const subscriptionRef = useRef(null);
  const consumerRef = useRef(null);
  const connectionAttemptedRef = useRef(false);
  const autoConnectAttemptedRef = useRef(false);
  const currentUserIdRef = useRef(userData?.id);
  const messagesLoadedRef = useRef(false);
  const userDataRef = useRef(userData);
  const processingRealTimeMessageRef = useRef(false);

  // State
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [optimisticMessages, setOptimisticMessages] = useState([]);

  // Update refs when props change
  useEffect(() => {
    authTokenRef.current = authToken;
    outletTypeRef.current = outletType;
    userDataRef.current = userData;
    currentUserIdRef.current = userData?.id;
  }, [authToken, outletType, userData]);

  // Load user messages via WebSocket ONLY
  const loadUserMessages = useCallback(async () => {
    console.log('📤 Loading user messages via WebSocket for user:', currentUserIdRef.current);
    console.log('📤 Function called at:', new Date().toISOString());
    console.log('📤 LOAD_MESSAGES_FUNCTION_CALLED'); // Unique identifier
    
    if (!subscriptionRef.current) {
      console.log('❌ Cannot load user messages: No subscription');
      return;
    }

    if (!isConnected) {
      console.log('❌ Cannot load user messages: WebSocket not connected yet');
      console.log('🔍 Connection status:', {
        subscriptionRef: !!subscriptionRef.current,
        isConnected,
        authToken: !!authTokenRef.current,
        outletType: outletTypeRef.current
      });
      return;
    }

    if (!currentUserIdRef.current) {
      console.error('❌ Cannot load user messages: No user ID available');
      return;
    }

    // Check if we're processing real-time messages - REMOVED THIS CHECK
    // if (processingRealTimeMessageRef.current) {
    //   console.log('⏸️ Skipping loadUserMessages - processing real-time message');
    //   return;
    // }

    setIsLoading(true);
    console.log('🔄 Setting loading state to true');

    try {
      // Request user's own messages via WebSocket
      const requestData = {
        action: 'request_my_messages',
        outlet_type: outletTypeRef.current,
        _function: 'loadUserMessages' // Add identifier
      };
      
      console.log('📤 Requesting user messages via WebSocket:', requestData);
      console.log('📤 Current user ID:', currentUserIdRef.current);
      console.log('📤 Outlet type:', outletTypeRef.current);
      console.log('📤 About to call subscriptionRef.current.perform...');
      console.log('📤 RequestData object:', requestData);
      console.log('📤 RequestData action:', requestData.action);
      
      // Send the request directly via send method to preserve the action field
      subscriptionRef.current.send(requestData);
      console.log('📤 send() called successfully');
      console.log('📤 Sent data to backend:', JSON.stringify(requestData));
      
      // Also try perform method as fallback
      setTimeout(() => {
        console.log('📤 Fallback: Sending request via perform method...');
        console.log('📤 Fallback requestData:', requestData);
        console.log('📤 Fallback requestData.action:', requestData.action);
        subscriptionRef.current.perform('receive', requestData);
        console.log('📤 Fallback data sent via perform:', JSON.stringify(requestData));
      }, 100);
      
      // Set a timeout to handle no response
      setTimeout(() => {
        if (isLoading) {
          console.log('⏰ No response received within 10 seconds, setting loading to false');
          setIsLoading(false);
        }
      }, 10000);
      
    } catch (error) {
      console.error('Error loading user messages via WebSocket:', error);
      setIsLoading(false);
    }
  }, [isConnected, isLoading]);

  // Auto-load messages when connection becomes active
  useEffect(() => {
    if (isConnected && subscriptionRef.current && currentUserIdRef.current && !messagesLoadedRef.current) {
      console.log('🔄 Connection is active, loading messages...');
      messagesLoadedRef.current = true;
      
      // Add longer delay to ensure connection is fully established
      setTimeout(() => {
        try {
          loadUserMessages();
        } catch (error) {
          console.error('Error auto-loading messages:', error);
        }
      }, 2000);
    }
  }, [isConnected, loadUserMessages]);

  // Send message via WebSocket
  const sendMessage = useCallback((content, messageType = 'text', productId = null) => {
    console.log('📤 SEND_MESSAGE called with content:', content);
    
    if (!subscriptionRef.current || !isConnected) {
      console.error('Cannot send message: not connected');
      throw new Error('WebSocket not connected');
    }

    if (!content || content.trim() === '') {
      console.error('Cannot send empty message');
      throw new Error('Message content cannot be empty');
    }

    if (!currentUserIdRef.current) {
      console.error('❌ Cannot send message: No user ID available');
      throw new Error('User ID not available');
    }

    const user = userDataRef.current || getActiveUser();
    const messageId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    console.log('📤 User sending message:', content);
    console.log('📤 Current user:', user);
    console.log('📤 Current user ID ref:', currentUserIdRef.current);
    
    // Create optimistic message
    const optimisticMessage = {
      id: messageId,
      content: content,
      message_type: messageType,
      user_id: currentUserIdRef.current,
      user_name: user?.name || 'You',
      user_email: user?.email || '',
      user_role: user?.role || 'user',
      timestamp: new Date().toISOString(),
      created_at: new Date().toISOString(),
      optimistic: true,
      display_time: new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })
    };

    // Add optimistic message immediately
    console.log('📤 Adding optimistic message:', optimisticMessage);
    setOptimisticMessages(prev => {
      const newOptimistic = [...prev, optimisticMessage];
      console.log('📤 Optimistic messages count:', prev.length, '->', newOptimistic.length);
      return newOptimistic;
    });

    // Create message data for Rails backend
    const messageData = {
      action: 'receive',
      message: {
        content: content,
        message_type: messageType,
        user_id: currentUserIdRef.current,
        user_name: user?.name || 'User',
        user_email: user?.email || '',
        user_role: user?.role || 'user',
        timestamp: new Date().toISOString()
      },
      outlet_type: outletTypeRef.current,
      _function: 'sendMessage' // Add identifier
    };

    // Add product_id if provided
    if (productId) {
      messageData.product_id = productId;
    }

    console.log('📤 Sending message data to backend:', JSON.stringify(messageData, null, 2));
    
    try {
      // Send using the 'receive' action via perform
      subscriptionRef.current.perform('receive', messageData);
      console.log('✅ Message sent successfully via WebSocket perform method');
      
      // Set timeout to clean up optimistic message if not confirmed by real-time update
      const timeoutId = setTimeout(() => {
        console.log('⏰ Checking optimistic message timeout for:', messageId);
        setOptimisticMessages(prev => {
          const stillExists = prev.find(msg => msg.id === messageId);
          if (stillExists) {
            console.log('⏰ Optimistic message still exists after timeout, converting to permanent');
            // Only convert to permanent if we haven't received a real-time update
            setMessages(current => {
              const alreadyExists = current.find(msg => 
                msg.content === stillExists.content && 
                Math.abs(new Date(msg.timestamp).getTime() - new Date(stillExists.timestamp).getTime()) < 10000
              );
              if (!alreadyExists) {
                console.log('⏰ Adding timeout message as permanent');
                const permanentMessage = { ...stillExists, optimistic: false };
                return [...current, permanentMessage];
              } else {
                console.log('⏰ Real message already exists, skipping permanent conversion');
              }
              return current;
            });
            return prev.filter(msg => msg.id !== messageId);
          }
          return prev;
        });
      }, 8000);
      
      console.log('📤 Set cleanup timeout for message:', messageId);
      
    } catch (error) {
      console.error('❌ Error sending message via WebSocket:', error);
      // Remove optimistic message on error
      setOptimisticMessages(prev => prev.filter(msg => msg.id !== messageId));
      throw error;
    }
  }, [isConnected]);

  // WebSocket connection using ActionCable
  const connect = useCallback(() => {
    console.log('🔐 User Connect function called');
    console.log('🔐 Connection attempted ref:', connectionAttemptedRef.current);
    console.log('🔐 Is connecting:', isConnecting);
    console.log('🔐 Is connected:', isConnected);
    
    if (!authTokenRef.current || !outletTypeRef.current) {
      const error = 'No authentication token or outlet type provided';
      setConnectionError(error);
      return;
    }

    if (connectionAttemptedRef.current || isConnecting || isConnected) {
      console.log('🔐 Connection already attempted or in progress, skipping...');
      return;
    }

    // Check if we already have active connections
    if (subscriptionRef.current || consumerRef.current) {
      console.log('🔐 Existing connection found, cleaning up first...');
      disconnect();
      return;
    }

    connectionAttemptedRef.current = true;
    setIsConnecting(true);
    setConnectionError(null);
    messagesLoadedRef.current = false; // Reset message loading flag

    console.log('🔐 User attempting to connect...');
    console.log('📝 Token (first 20 chars):', authTokenRef.current.substring(0, 20) + '...');
    console.log('🏪 Outlet type:', outletTypeRef.current);
    console.log('👤 Current user ID:', currentUserIdRef.current);

    try {
      // Create Action Cable consumer with token as query parameter
      consumerRef.current = createConsumer(`wss://sephcocco-lounge-api.onrender.com/cable?token=${encodeURIComponent(authTokenRef.current)}`);

      console.log('✅ Consumer created, attempting to subscribe...');

      // Subscribe to messaging channel - USER CHANNEL
      subscriptionRef.current = consumerRef.current.subscriptions.create(
        {
          channel: "MessagingChannel",
          outlet_type: outletTypeRef.current
        },
        {
          connected() {
            setIsConnected(true);
            setIsConnecting(false);
            setConnectionError(null);
            console.log('🎉 User successfully connected to messaging channel');
            console.log('📡 User channel: messaging_user_' + currentUserIdRef.current);
            console.log('🏪 Outlet type:', outletTypeRef.current);
            
            // Load user messages when connected
            setTimeout(() => {
              if (subscriptionRef.current && currentUserIdRef.current && !messagesLoadedRef.current) {
                console.log('⏰ Loading user messages after connection...');
                messagesLoadedRef.current = true;
                loadUserMessages();
              }
            }, 2000); // Increased delay
            
            // Send a ping to test connection
            setTimeout(() => {
              if (subscriptionRef.current) {
                console.log('🏓 Sending ping to test connection...');
                subscriptionRef.current.send({ type: 'ping', timestamp: Date.now() });
              }
            }, 3000);
          },

          disconnected() {
            setIsConnected(false);
            setIsConnecting(false);
            connectionAttemptedRef.current = false;
            messagesLoadedRef.current = false;
            console.log('💔 User disconnected from messaging channel');
          },

          rejected() {
            setIsConnected(false);
            setIsConnecting(false);
            connectionAttemptedRef.current = false;
            messagesLoadedRef.current = false;
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
            
            // Handle test response
            if (data.type === 'test_response') {
              console.log('🧪 Test response received:', data);
              return;
            }
            
            // Handle user messages response from WebSocket
            if (data.type === 'user_messages_response') {
              console.log('📨 User messages response received:', data);
              console.log('📨 Messages count:', data.messages?.length || 0);
              console.log('📨 User ID:', data.user_id);
              console.log('📨 Current user ID:', currentUserIdRef.current);
              console.log('📨 Response matches current user:', data.user_id === currentUserIdRef.current);
              
              const receivedMessages = data.messages || [];
              
              // Process and standardize messages
              const processedMessages = receivedMessages.map(msg => ({
                id: msg.id,
                content: msg.content,
                message_type: msg.message_type || 'text',
                user_id: msg.user_id,
                user_name: msg.user_name,
                user_email: msg.user_email || '',
                user_role: msg.user_role,
                timestamp: msg.timestamp || msg.created_at,
                created_at: msg.created_at || msg.timestamp,
                display_time: new Date(msg.timestamp || msg.created_at).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false
                })
              }));
              
              console.log('📨 Processed messages:', processedMessages);
              console.log('📨 Current messages count before update:', messages.length);
              
              // Only update if we have new messages or if current messages are empty
              if (processedMessages.length > 0 || messages.length === 0) {
                console.log('📨 Setting messages state with:', processedMessages.length, 'messages');
                setMessages(processedMessages);
              } else {
                console.log('📨 Skipping message update - keeping existing messages');
              }
              
              setIsLoading(false);
              console.log('✅ User messages loaded from WebSocket:', processedMessages.length);
              return;
            }
            
            // Handle real-time new messages - EXPANDED TYPES AND BETTER LOGGING
            if (data.type === 'new_message' || 
                data.type === 'broadcast_message' || 
                data.type === 'message_broadcast' || 
                data.type === 'message_updated' ||
                data.type === 'chat_message' ||
                data.broadcast === true) {
              
              console.log('🚨 REAL-TIME: User received new message!');
              console.log('🚨 Message received at:', new Date().toISOString());
              console.log('💬 Full data object:', JSON.stringify(data, null, 2));
              console.log('💬 Message type:', data.type);
              console.log('💬 Message content:', data.content);
              console.log('💬 Data sender_id:', data.sender_id);
              console.log('💬 Data user.id:', data.user?.id);
              console.log('💬 Data user_id:', data.user_id);
              console.log('💬 Data thread_owner_id:', data.thread_owner_id);
              console.log('💬 Current user ID:', currentUserIdRef.current);
              console.log('💬 Broadcast flag:', data.broadcast);

              // Create standardized message object
              const currentTimestamp = data.created_at || data.timestamp || new Date().toISOString();
              const senderId = data.sender_id || data.user?.id || data.user_id;
              const threadOwnerId = data.thread_owner_id || data.user_id || senderId;
              const isFromCurrentUser = String(senderId) === String(currentUserIdRef.current);
              
              const standardizedMessage = {
                id: String(data.id || data.chat_id || `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`),
                content: data.content,
                message_type: data.message_type || 'text',
                user_id: senderId,
                user_name: isFromCurrentUser ? 'You' : (data.user?.name || data.sender?.name || data.user_name || 'Admin'),
                user_email: data.user?.email || data.sender?.email || data.user_email || '',
                user_role: data.user_role || data.user?.role || data.sender?.role || 'user',
                timestamp: currentTimestamp,
                created_at: currentTimestamp,
                display_time: new Date(currentTimestamp).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false
                })
              };

              console.log('📨 Processed standardized message:', standardizedMessage);
              console.log('📨 Sender ID extracted:', senderId);
              console.log('📨 Thread owner ID extracted:', threadOwnerId);
              console.log('📨 Is from current user:', isFromCurrentUser);

              // More flexible conversation checking - IMPROVED LOGIC
              const isMyConversation = (
                // If no thread owner specified, assume it's for current user
                !threadOwnerId || 
                // If thread owner matches current user
                String(threadOwnerId) === String(currentUserIdRef.current) ||
                // If the message is from current user (they should always see their own messages)
                isFromCurrentUser ||
                // If it's explicitly marked as broadcast
                data.broadcast === true ||
                // If it's sent TO current user (check user_id in data)
                String(data.user_id) === String(currentUserIdRef.current)
              );

              console.log('🔍 Message belongs to current user conversation:', isMyConversation);
              console.log('🔍 Detailed conversation check:');
              console.log('   - Thread owner ID:', threadOwnerId);
              console.log('   - Current user ID:', currentUserIdRef.current);
              console.log('   - No thread owner ID:', !threadOwnerId);
              console.log('   - Thread owner matches current user:', String(threadOwnerId) === String(currentUserIdRef.current));
              console.log('   - Is from current user:', isFromCurrentUser);
              console.log('   - Is broadcast message:', data.broadcast === true);
              console.log('   - Data user_id:', data.user_id);
              console.log('   - Data user_id matches current user:', String(data.user_id) === String(currentUserIdRef.current));

              if (isMyConversation) {
                console.log('✅ Adding real-time message to user messages!');
                
                // If this is from current user, remove matching optimistic message
                if (isFromCurrentUser) {
                  console.log('🔄 Removing matching optimistic message');
                  setOptimisticMessages(prev => {
                    const filtered = prev.filter(msg => {
                      const isMatch = msg.content === data.content && msg.optimistic;
                      if (isMatch) {
                        console.log('🔄 Found matching optimistic message to remove:', msg.id);
                      }
                      return !isMatch;
                    });
                    
                    if (filtered.length !== prev.length) {
                      console.log('🔄 Removed optimistic message. Count:', prev.length, '->', filtered.length);
                    }
                    return filtered;
                  });
                }
                
                setMessages(prev => {
                  console.log('📨 Current messages before adding:', prev.length);
                  console.log('📨 Attempting to add message:', standardizedMessage);
                  
                  // Content-based duplicate check only - allow multiple messages with same ID but different content
                  const hasSimilarMessage = prev.some(msg => {
                    const sameContent = msg.content === standardizedMessage.content;
                    const sameUser = msg.user_id === standardizedMessage.user_id;
                    const recentTime = Math.abs(new Date(msg.timestamp).getTime() - new Date(currentTimestamp).getTime()) < 500; // Reduced to 500ms
                    
                    const isDuplicate = sameContent && sameUser && recentTime;
                    
                    if (isDuplicate) {
                      console.log('⚠️ Found potential duplicate:', {
                        existingMsg: { id: msg.id, content: msg.content, timestamp: msg.timestamp, user_id: msg.user_id },
                        newMsg: { id: standardizedMessage.id, content: standardizedMessage.content, timestamp: standardizedMessage.timestamp, user_id: standardizedMessage.user_id },
                        timeDiff: Math.abs(new Date(msg.timestamp).getTime() - new Date(currentTimestamp).getTime())
                      });
                    }
                    
                    return isDuplicate;
                  });
                  
                  if (hasSimilarMessage) {
                    console.log('⚠️ Very similar recent message exists, skipping');
                    return prev;
                  }
                  
                  // Check if this is a very old message trying to be added
                  const messageTime = new Date(currentTimestamp).getTime();
                  const now = Date.now();
                  const isVeryOld = (now - messageTime) > 300000; // 5 minutes
                  
                  if (isVeryOld && prev.length > 0) {
                    console.log('⚠️ Message is very old, might be duplicate from history load, skipping');
                    return prev;
                  }
                  
                  const newMessages = [...prev, standardizedMessage];
                  console.log('✅ Real-time message added! New count:', newMessages.length);
                  console.log('✅ Added message details:', {
                    id: standardizedMessage.id,
                    content: standardizedMessage.content,
                    user_id: standardizedMessage.user_id,
                    user_name: standardizedMessage.user_name,
                    timestamp: standardizedMessage.timestamp,
                    isFromCurrentUser
                  });
                  
                  return newMessages;
                });
              } else {
                console.log('⚠️ Message not for current user, ignoring');
              }
              
              return;
            }
            
            // Handle errors
            if (data.error) {
              console.error('❌ WebSocket error received:', data.error);
              setIsLoading(false);
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
      messagesLoadedRef.current = false;
      setConnectionError(errorMsg);
    }
  }, []); // No dependencies to prevent recreation

  const disconnect = useCallback(() => {
    console.log('🧹 User cleaning up connection...');
    
    // Reset connection flags first
    connectionAttemptedRef.current = false;
    autoConnectAttemptedRef.current = false;
    messagesLoadedRef.current = false;
    
    // Clean up subscription
    if (subscriptionRef.current) {
      try {
        subscriptionRef.current.unsubscribe();
      } catch (error) {
        console.log('⚠️ Error unsubscribing:', error);
      }
      subscriptionRef.current = null;
    }
    
    // Clean up consumer
    if (consumerRef.current) {
      try {
        consumerRef.current.disconnect();
      } catch (error) {
        console.log('⚠️ Error disconnecting consumer:', error);
      }
      consumerRef.current = null;
    }
    
    setIsConnected(false);
    setIsConnecting(false);
  }, []);

  // Auto-connect
  useEffect(() => {
    console.log('🔌 User Auto-connect useEffect triggered');
    console.log('🔑 Auth token present:', !!authToken);
    console.log('🏪 Outlet type:', outletType);
    console.log('🔄 Auto connect attempted:', autoConnectAttemptedRef.current);
    console.log('🔗 Is connected:', isConnected);
    console.log('🔄 Is connecting:', isConnecting);
    
    if (authToken && outletType && !autoConnectAttemptedRef.current && !isConnected && !isConnecting) {
      console.log('🚀 User auto-connecting to WebSocket...');
      autoConnectAttemptedRef.current = true;
      connect();
    } else {
      console.log('⏭️ Skipping auto-connect:');
      console.log('   - authToken:', !!authToken);
      console.log('   - outletType:', outletType);
      console.log('   - autoConnectAttempted:', autoConnectAttemptedRef.current);
      console.log('   - isConnected:', isConnected);
      console.log('   - isConnecting:', isConnecting);
    }

    return () => {
      console.log('🧹 User cleaning up WebSocket connection...');
      disconnect();
      autoConnectAttemptedRef.current = false;
    };
  }, [authToken, outletType]); // Removed connect and disconnect from dependencies

  // Function to refresh messages
  const refreshMessages = useCallback(async () => {
    messagesLoadedRef.current = false;
    await loadUserMessages();
  }, [loadUserMessages]);

  // Function to clear optimistic messages
  const clearOptimisticMessages = useCallback(() => {
    setOptimisticMessages([]);
  }, []);

  // Combine messages and optimistic messages for display
  const allMessages = [...messages, ...optimisticMessages].sort((a, b) => 
    new Date(a.timestamp) - new Date(b.timestamp)
  );

  return {
    // Connection state
    isConnected,
    isConnecting,
    connectionError,
    
    // Loading state
    isLoading,
    
    // Data
    messages, // Confirmed messages from server
    optimisticMessages, // Messages being sent
    allMessages, // Combined for display
    
    // Actions
    sendMessage,
    refreshMessages,
    clearOptimisticMessages,
    triggerMessageLoad: () => {
      console.log('🔄 Manually triggering message load...');
      if (subscriptionRef.current && isConnected) {
        const requestData = {
          action: 'request_my_messages',
          outlet_type: outletTypeRef.current
        };
        
        console.log('📤 Manual request data:', requestData);
        console.log('📤 Manual request data JSON:', JSON.stringify(requestData));
        
        // Send directly via send method to preserve the action field
        subscriptionRef.current.send(requestData);
        console.log('📤 Manual request sent via send');
        
        // Also try perform method as fallback
        setTimeout(() => {
          console.log('📤 Manual request fallback via perform');
          subscriptionRef.current.perform('receive', requestData);
        }, 100);
      } else {
        console.log('❌ Cannot trigger message load - not connected');
      }
    }
  };
};
