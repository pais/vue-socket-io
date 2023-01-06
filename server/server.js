import { createServer } from "http";
import { Server } from "socket.io";
import * as amqp from "amqplib";

const httpServer = createServer();
const io = new Server(httpServer, {
  path: "/vote/",
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  },
  transports: ['websocket', 'polling'],
  credentials: true
});

io.on("connection", (socket) => {
  socket.broadcast.emit("started", "lets go");
  console.log(socket.handshake.query);
});

connect_rabbitmq()

async function connect_rabbitmq() {
  const connection = await amqp.connect('amqp://localhost')
  const channel = await connection.createChannel()

  channel.consume("PollingQueue", data => {
    console.log("gelen oy: ", JSON.parse(data.content.toString()));
    io.emit("polling", JSON.parse(data.content.toString()));
    channel.ack(data);
  })
}

httpServer.listen(3000);
