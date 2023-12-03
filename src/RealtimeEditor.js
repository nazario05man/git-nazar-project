import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';

const RealtimeEditor = () => {
  const [code, setCode] = useState('');
  const [socketConnection, setSocketConnection] = useState(null);

  useEffect(() => {
    // Встановлюємо підключення при завантаженні компонента
    setSocketConnection(socketIOClient(window.location.origin));

    return () => {
      // Закриваємо підключення при виході з компонента
      if (socketConnection) {
        socketConnection.disconnect();
      }
    };
  }, []);

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    // Відправляємо оновлений код на сервер
    if (socketConnection) {
      socketConnection.emit('code-update', newCode);
    }
  };

  return (
    <div>
      {/* Ваш код реального часу тут */}
      <textarea value={code} onChange={(e) => handleCodeChange(e.target.value)} />
    </div>
  );
};

export default RealtimeEditor;
