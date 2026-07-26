import { io } from 'socket.io-client';

const URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:4000';

export const socket = io(URL, {
  autoConnect: true,
  transports: ['websocket', 'polling'],
});

export function emitAsync(event, payload) {
  return new Promise((resolve) => {
    socket.timeout(8000).emit(event, payload, (err, res) => {
      if (err) return resolve({ error: 'Server did not respond. Is it running?' });
      return resolve(res || {});
    });
  });
}
