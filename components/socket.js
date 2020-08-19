const socketIo = require("socket.io");

class SocketService {
  constructor(server, redis) {
    var rtg = require("url").parse(
      "redis://redistogo:c6e217b1af8286546da4e15fc25afea0@scat.redistogo.com:9459/"
    );
    var redis = require("redis").createClient(rtg.port, rtg.hostname);

    redis.auth(rtg.auth.split(":")[1]);

    this.io = socketIo(server);

    this.io.use(function (socket, next) {
      if (socket.handshake.query && socket.handshake.query.token) {
        console.log(socket.handshake.query.token);
        socket.userId = socket.handshake.query.token;
        next();
      }
    });

    this.io.engine.generateId = function (req) {
      // generate a new custom id here
      console.log(req._query);

      return req._query.token;
    };

    //    this.io.on('connection', socket => {

    //      this.io.to(socket.id).emit('hey', 'I just met you'+socket.id);
    //      console.log('user connected')
    //  });

    const workspaces = this.io.of(/^\/\w+$/);

    workspaces.on("connection", (socket) => {
      const workspace = socket.nsp;
      console.log("connecting");
      console.log(socket.nsp.name.split("/")[1]);
      //workspace.emit('hey',"Sdsd");

      if (socket.nsp.name.split("/")[1] == socket.id.split("#")[1]) {
        socket.nsp.emit("status", "connected");
        redis.set(socket.id.split("#")[1], true, (err, data) => {

          console.log("setting",data);
        });

      } else {

        console.log("view other staus");
        redis.get(socket.nsp.name.split("/")[1], (err, data) => {
          console.log(data);
          if (data) {
            console.log("viewing",socket.nsp.name.split("/")[1])
            socket.nsp.emit("status", "connected");
          }
        });
      }

   

  

      socket.on("disconnect", (data) => {
        console.log("disconnecting");

        if(socket.nsp.name.split("/")[1] == socket.id.split("#")[1])
        {
          socket.nsp.emit("status", "disconnected");

        //workspace.emit('hey',"Sdsd");
        redis.del(socket.id.split("#")[1], (err, reply) => {})}
      });

      socket.on("getStatus", (data, callback) => {
        console.log("getting staus");
        callback("sai hai");
      });
    });

 

    // this middleware will be assigned to each namespace

    //    this.io.on('connection', socket => {

    //      this.io.to(socket.id).emit('message1', 'I just met you'+socket.id);
    //      console.log('user connected')
    //  });
  }

  emiter(event, body) {
    if (body) this.io.emit(event, body);
  }
}

module.exports = SocketService;
