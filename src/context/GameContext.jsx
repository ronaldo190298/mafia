import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { emitAsync, socket } from '../lib/socket';

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [state, setState] = useState(null);
  const [connected, setConnected] = useState(socket.connected);
  const [toast, setToast] = useState(null);
  const [pending, setPending] = useState(0);
  const [playerName, setPlayerName] = useState(() => localStorage.getItem('mafia:name') || '');

  useEffect(() => {
    const onState = (payload) => setState(payload);
    const onConnect = () => setConnected(true);
    const onDisconnect = () => {
      setConnected(false);
      setState(null);
    };
    socket.on('room:state', onState);
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    return () => {
      socket.off('room:state', onState);
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const rememberName = useCallback((name) => {
    setPlayerName(name);
    localStorage.setItem('mafia:name', name);
  }, []);

  const roomId = state?.roomId || null;

  const withLoading = useCallback(async (promise) => {
    setPending((n) => n + 1);
    try {
      return await promise;
    } finally {
      setPending((n) => n - 1);
    }
  }, []);

  const call = useCallback(
    async (event, payload = {}) => {
      const res = await withLoading(emitAsync(event, { roomId, ...payload }));
      if (res?.error) setToast({ type: 'error', text: res.error });
      return res;
    },
    [roomId, withLoading],
  );

  const actions = useMemo(
    () => ({
      createRoom: (name) => withLoading(emitAsync('room:create', { name })),
      joinRoom: (name, id) => withLoading(emitAsync('room:join', { name, roomId: id })),
      sync: (id) => withLoading(emitAsync('room:sync', { roomId: id })),
      addBots: (count) => call('lobby:addBots', { count }),
      removeBots: () => call('lobby:removeBots'),
      setReady: (ready) => call('lobby:ready', { ready }),
      startGame: () => call('game:start'),
      restart: () => call('game:restart'),
      kill: (targetId) => call('night:kill', { targetId }),
      save: (targetId) => call('night:save', { targetId }),
      vote: (targetId) => call('vote:cast', { targetId }),
      sendChat: (text, channel = 'public') => call('chat:send', { text, channel }),
      typing: (isTyping) => socket.emit('chat:typing', { roomId, isTyping }),
      leave: () => {
        socket.emit('room:leave');
        setState(null);
      },
    }),
    [call, roomId, withLoading],
  );

  const value = useMemo(
    () => ({ state, connected, toast, setToast, playerName, rememberName, actions, pending }),
    [state, connected, toast, playerName, rememberName, actions, pending],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used inside <GameProvider>');
  return ctx;
}
