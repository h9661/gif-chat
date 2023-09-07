const WebSocket = require('ws');

// similar with net module that i've used in boostcamp chanllange.
module.exports = (server)=>{
    const wss = new WebSocket.Server({
        server,
        backlog:1024
    });

    wss.on('connection',(ws,req)=>{
        // get client ip address this method is popular. search and study.
        const ip = req.headers['x-forwarded-for']||req.connection.remoteAddress;
        console.log('새로운 클라이언트 접속',ip);
        ws.on('message',(message)=>{
            console.log(message);
        });
        ws.on('error',(error)=>{
            console.error(error);
        });
        ws.on('close',()=>{
            console.log('클라이언트 접속 해제',ip);
            clearInterval(ws.interval);
        });
        const interval = setInterval(()=>{
            if(ws.readyState===ws.OPEN){
                ws.send('서버에서 클라이언트로 메시지를 보냅니다.');
            }
        },3000);
        ws.interval = interval;
    });
};