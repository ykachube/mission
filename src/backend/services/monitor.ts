// src/backend/services/monitor.ts
import net from 'net';

export const checkTcpConnection = (host: string, port: number): Promise<boolean> => {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let isAlive = false;

    socket.on('connect', () => {
      isAlive = true;
      socket.destroy();
    });

    socket.on('error', () => {
      isAlive = false;
      socket.destroy();
    });

    socket.on('close', () => {
      resolve(isAlive);
    });

    socket.connect(port, host);
  });
};