const SocketIO = require('socket.io');
const config = require('../config')
module.exports = async(server) => {
  console.log('init websocket');
  // socket.io
  let socketHandle = SocketIO(server, {
    serveClient: true,
    path: config.socketioPath
  });

  socketHandle.on('connection', function (socket) {
    console.log('socket已连接...');

    // 离开编辑文章页面
    socket.on('disconnect', function () {
    });

    // 进入新增文章页面，获取已保存的草稿（可以为空）
    socket.on('getDraftPost', async function () {
      // socket.emit('getDraftPost', data);
    });
    // 断开连接
    socket.on('disconnect', function () {
      console.log('socket已断开...');
    });
  });
}