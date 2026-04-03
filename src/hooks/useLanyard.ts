import { useState, useEffect, useRef, useCallback } from 'react';
import type { LanyardData } from '@/types/lanyard';

const LANYARD_WS = 'wss://api.lanyard.rest/socket';

interface UseLanyardOptions {
  userId: string;
}

interface LanyardOp {
  op: number;
  d?: unknown;
  t?: string;
  seq?: number;
}

export function useLanyard({ userId }: UseLanyardOptions) {
  const [data, setData] = useState<LanyardData | undefined>();
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const heartbeatRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    if (!userId) return;

    if (socketRef.current) {
      socketRef.current.close();
    }

    const ws = new WebSocket(LANYARD_WS);
    socketRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const message: LanyardOp = JSON.parse(event.data);

        switch (message.op) {
          case 1: // Hello
            const helloData = message.d as { heartbeat_interval: number };
            const interval = helloData.heartbeat_interval;
            // Start Heartbeat
            if (heartbeatRef.current) clearInterval(heartbeatRef.current);
            heartbeatRef.current = setInterval(() => {
              if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ op: 3 }));
              }
            }, interval);

            // Send Initialize
            ws.send(
              JSON.stringify({
                op: 2,
                d: { subscribe_to_id: userId },
              })
            );
            break;

          case 0: // Event
            if (message.t === 'INIT_STATE' || message.t === 'PRESENCE_UPDATE') {
              // INIT_STATE returns data directly, PRESENCE_UPDATE returns data with user_id
              // For single user subscription, INIT_STATE is the data object directly
              // But usually INIT_STATE for single ID is just the data.
              // PRESENCE_UPDATE is the full new state.
              // Let's handle both.
              setData(message.d as LanyardData);
            }
            break;
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') console.error('Lanyard WS Parse Error:', error);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
      // Simple reconnect logic
      setTimeout(connect, 3000);
    };

    ws.onerror = (error) => {
      if (process.env.NODE_ENV === 'development') console.error('Lanyard WS Error:', error);
      ws.close();
    };
  }, [userId]);

  useEffect(() => {
    // Debounce connection to prevent Strict Mode double-invocation causing "WebSocket closed before connection" errors
    const timeoutId = setTimeout(() => {
      connect();
    }, 50);

    return () => {
      clearTimeout(timeoutId);
      if (socketRef.current) {
        // Prevent reconnect logic from firing on unmount
        socketRef.current.onclose = null;
        socketRef.current.close();
      }
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
    };
  }, [connect]);

  return {
    data,
    isLoading: !data,
    error: !isConnected && !data ? 'Disconnected' : null,
  };
}
