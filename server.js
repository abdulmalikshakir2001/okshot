const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  // Create HTTP server
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    // Attach io instance to the request object
    req.io = io;
    handle(req, res, parsedUrl);
  });

  // Initialize socket.io after the server is created
  const io = new Server(server);

  io.on('connection', (socket) => {
    console.log('A client connected');

    socket.on('disconnect', () => {
      console.log('A client disconnected');
    });
  });

  server.listen(4002, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:4002');
  });
});
