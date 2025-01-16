
const  { Server } = require("socket.io");
const User=require("../models/user")
class SocketService {
  constructor(server) {
 
    this.io = new Server(server, {
    cors:{
      origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["*"],
        credentials: true
    }
    });

    this.io.use(function (socket, next) {
      if (socket.handshake.query && socket.handshake.query.token) {
    
        socket.userId = socket.handshake.query.token;
      
        next();
      }
    });

//     this.io.engine.generateId =  (req)=> {
//       // generate a new custom id here
     
// //console.log(req._query.token,"query here")
//       return req._query.token;
//     };

    this.io.on("connection", (socket) => {
     
       socket.join(socket.userId+"")
      this.io.emit(socket.id+"", {type:"status",isConnected:true})
   
      if(socket.id)
      // User.updateOne({_id:socket.id},{lastActive:new Date() }).then((data)=>{
      //   console.log(data)
      // })
      


     




      socket.on("disconnect",(data) => {
        console.log(socket.handshake.query);
        if(socket.id)
        // User.updateOne({_id:socket.id},{lastActive:new Date() }).then((data)=>{
        //   console.log(data)
        // })
        if (this.io.sockets.sockets[socket.id]&&this.io.sockets.sockets[socket.id].connected) {
           
          this.io.emit(socket.id, {type:"status",isConnected:true})
                    }
                    else{
                    
                      this.io.emit(socket.id+"", {type:"status",isConnected:false})
                    }
     


      })

     
      socket.on("getStatus",(data,callback) => {

        
      
          if (this.io.sockets.sockets[data]&&this.io.sockets.sockets[data].connected) {
            console.log("connected",socket.id)
callback({type:"status",isConnected:true})
          }
          else{
            callback({type:"status",isConnected:false})
          }




        
      })





    });

    //   const workspaces = this.io.of(/^\/\w+$/);

    //  workspaces.use(function (socket, next) {
    //     if (socket.handshake.query && socket.handshake.query.token) {
    //       console.log(socket.handshake.query.token);
    //       socket.userId = socket.handshake.query.token;
    //       console.log("userId is",socket.userId)
    //       next();
    //     }
    //   });

    //   workspaces.on("connection", (socket) => {
    //     console.log("hwt adks ",socket.userId)
    //     const workspace = socket.nsp;
    //     console.log("connecting");
    //     console.log(socket.nsp.name.split("/")[1]);
    //     //workspace.emit('hey',"Sdsd");

    //     if (socket.nsp.name.split("/")[1] == socket.userId) {
    //       socket.nsp.emit("status", "connected");
    //       redis.set(socket.userId, true, (err, data) => {

    //         console.log("setting",data);
    //       });

    //     } else {

    //       console.log("view other staus");
    //       redis.get(socket.nsp.name.split("/")[1], (err, data) => {
    //         console.log(data);
    //         if (data) {
    //           console.log("viewing",socket.nsp.name.split("/")[1])
    //           socket.nsp.emit("status", "connected");
    //         }
    //       });
    //     }

    //     socket.on("disconnect", (data) => {
    //       console.log("disconnecting");

    //       if(socket.nsp.name.split("/")[1] ==socket.userId)
    //       {
    //         socket.nsp.emit("status", "disconnected");

    //       //workspace.emit('hey',"Sdsd");
    //       redis.del(socket.userId, (err, reply) => {})}
    //     });

    //     socket.on("getStatus", (data, callback) => {
    //       redis.get(socket.nsp.name.split("/")[1], (err, data) => {})
    //       callback("sai hai");
    //     });
    //   });

    // this middleware will be assigned to each namespace

    //    this.io.on('connection', socket => {

    //      this.io.to(socket.id).emit('message1', 'I just met you'+socket.id);
    //      console.log('user connected')
    //  });
  }

  emiter(event, body) {
    if (body) this.io.emit(event, body);
  }

  sendTo(id,event, body) {
    if (body) {
      console.log(id)
      this.io.to(id+"").emit(event, body);
    
    }
  }
}

module.exports = SocketService;
