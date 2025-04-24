const udp = require('dgram');
const os = require('os');

// Get local IP
const interfaces = os.networkInterfaces();
let localIP = '127.0.0.1';
for (let iface in interfaces) {
  for (let i = 0; i < interfaces[iface].length; i++) {
    const addr = interfaces[iface][i];
    if (addr.family === 'IPv4' && !addr.internal) {
      localIP = addr.address;
      break;
    }
  }
}

// Start servers on ports 9000 to 9050
for (let port = 9000; port <= 9050; port++) {
  const server = udp.createSocket('udp4');

  server.on('error', (err) => {
    console.log(`Server error:\n${err.stack}`);
    server.close();
  });

  server.on('message', (msg, rinfo) => {
    console.log(`Received from ${rinfo.address}:${rinfo.port} - ${msg.toString()}`);

    const response = Buffer.from(`Hello from server ${localIP}:${port}`);
    server.send(response, rinfo.port, rinfo.address, (err) => {
      if (err) console.log(`Error sending response: ${err}`);
      else console.log(`Sent response to ${rinfo.address}:${rinfo.port}`);
    });
  });

  server.on('listening', () => {
    const address = server.address();
    console.log(`Server listening on ${address.address}:${address.port}`);
  });
server.bind(port);
}
