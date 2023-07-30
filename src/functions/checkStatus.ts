import { Socket } from 'net';

function pingIP(ip: string, port: number, callback: (error: Error | null, success: boolean, responseData: string | null) => void) {
  const socket: Socket = new Socket();
  let responseData: string = '';

  // Set a timeout for the connection attempt
  const timeout: number = 2000; // 2 seconds
  let timer: NodeJS.Timeout;

  socket.on('connect', () => {
    clearTimeout(timer);
    // Send a message to the server (if required)
    // For example, you can send a message like 'PING' to the server
    // socket.write('PING');
  });

  socket.on('data', (data: Buffer) => {
    responseData += data.toString(); // Accumulate the data from the server
  });

  socket.on('end', () => {
    socket.destroy();
    callback(null, true, responseData);
  });

  socket.on('error', (err: Error) => {
    clearTimeout(timer);
    socket.destroy();
    callback(err, false, null);
  });

  socket.on('timeout', () => {
    clearTimeout(timer);
    socket.destroy();
    callback(new Error('Connection timeout'), false, null);
  });

  // Connect to the IP and port
  socket.connect(port, ip);

  // Set the timeout for the connection attempt
  timer = setTimeout(() => {
    socket.destroy();
    callback(new Error('Connection timeout'), false, null);
  }, timeout);
}

export { pingIP };
