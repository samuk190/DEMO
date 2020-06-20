// import mongoose from 'mongoose';
import app from './app';
// import User from './app/models/User';
// import Message from './app/schemas/Message';
import Message from './app/models/Message';
import User from './app/models/User';
import File from './app/models/File';

const socketioJwt = require('socketio-jwt');
// import chat from './Chat';
// const http = require('http');

const server = require('http').Server(app);

// parte io
// function serializeResult(chat) {
//   const serialized = chat.map(msg => ({ _id: msg.id, ...msg }));

//   return serialized;
// }
const io = require('socket.io')(server, {
  transports: ['websocket', 'polling'],

  serveClient: false,
  // below are engine.IO options
  pingInterval: 10000,
  wsEngine: 'ws',
  pingTimeout: 5000,
  cookie: false,
});

io.use(
  socketioJwt.authorize({
    secret: 'rakk9912x',
    handshake: true,
    auth_header_required: true,
  })
);
server.listen(3333);
// async function encontrarUsuario() {
//   const user = await User.findByPk(socket.decoded_token.id);
//   console.log(`hello! ${user.name}`);
//   return user;
// }
// encontrarUsuario();

// socket.on('chat message', msg => {
//   console.log(msg);
// });
io.on('connection', socket => {
  socket.on('loadMessages', async () => {
    Message.findAll({
      where: { isGroup: true },
      attributes: [['id', '_id'], 'text', ['created_at', 'createdAt']],
      order: [['created_at', 'DESC']],
      include: [
        {
          model: User,
          as: 'user',
          attributes: [['id', '_id'], 'name', 'provider'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    }).then(chat => {
      io.sockets.emit('loadMessages', chat);
    });
    // io.sockets.emit('loadMessages', chat);
    // console.log(response);

    // Message.find({})
    //   .sort([['createdAt', 'descending']])
    //   .limit(10)
    //   .then(chat => {
    //     console.log(chat);
    //     io.sockets.emit('loadMessages', chat);
    //   });
  });
  socket.on('newMessage', msg => {
    Message.create({
      user_id: socket.decoded_token.id,
      isGroup: true,
      text: msg[0].text,
      createdAt: msg[0].createdAt,
    }).then(chat => {
      io.sockets.emit('newMessageAll', msg[0]);
    });

    // const newMessage = new Message({
    //   _id: new mongoose.Types.ObjectId(),
    //   text: msg[0].text,
    //   user: msg[0].user,
    //   createdAt: msg[0].createdAt,
    // });

    // message.save(function(err) {
    //   if (err) {
    //     console.log('err', err);
    //     return;
    //   }
    //   message.populate('user', 'nick guild color alliance', function(
    //     // err,
    //     doc
    //   ) {
    //     io.sockets.emit('newMessageAll', doc);
    //   });
    // });
  });
  // socket.on('loadMessages', msg => {
  //   socket.emit('loadMessages', 'test');
  //   return 'teste';
  // });
});
