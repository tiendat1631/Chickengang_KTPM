/* eslint-disable no-undef */
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Custom hook for WebSocket connection using STOMP
 * @param {string} url - The WebSocket endpoint URL (default: http://localhost:8080/ws)
 * @returns {Object} - { isConnected, subscribe, sendMessage, client }
 */
export const useWebSocket = (url = 'http://localhost:8080/ws') => {
  const clientRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Create the STOMP client
    const client = new Client({
      // brokerURL: 'ws://localhost:8080/ws', // Use this for pure WebSocket if not using SockJS
      webSocketFactory: () => new SockJS(url), // Use this for SockJS fallback
      
      onConnect: (frame) => {
        console.log('Connected: ' + frame);
        setIsConnected(true);
      },
      
      onDisconnect: () => {
        console.log('Disconnected');
        setIsConnected(false);
      },
      
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      },

      // Reconnect automatically
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.activate();
    clientRef.current = client;

    return () => {
      if (client.active) {
        client.deactivate();
      }
    };
  }, [url]);

  const subscribe = useCallback((destination, callback) => {
    if (clientRef.current && clientRef.current.connected) {
       const subscription = clientRef.current.subscribe(destination, (message) => {
          callback(JSON.parse(message.body));
       });
       return subscription;
    } else {
        console.warn('WebSocket not connected. Cannot subscribe to', destination);
        return null;
    }
  }, []);

  const sendMessage = useCallback((destination, body) => {
    if (clientRef.current && clientRef.current.connected) {
      clientRef.current.publish({
        destination,
        body: JSON.stringify(body),
      });
    } else {
       console.warn('WebSocket not connected. Cannot send message to', destination);
    }
  }, []);

  return {
    isConnected,
    subscribe,
    sendMessage,
    client: clientRef.current,
  };
};

export default useWebSocket;
