import WebSocket ,{ OPEN, WebSocketServer } from 'ws';
import http from 'http'

const server = http.createServer(function( req, res){
       res.end("hi");
})

const wss = new WebSocketServer({ server });

interface videoId {
   roomid  : number
}

const videoRooms = new Map<number,WebSocket[]>() //videoid, websocket userId.
const userRoomMap = new Map<WebSocket,number>() // userId , videoId

function handleVideoSubscribeEvent(videoId : number, ws : WebSocket){
   try {
    if(!videoRooms.has(videoId)){
        videoRooms.set(videoId,[ws]); 
     }
     else{
       let videoroom = videoRooms.get(videoId);
       if(videoroom){
         videoroom.push(ws);
       }
      userRoomMap.set(ws,videoId);
      ws.send(JSON.stringify({msg :"VideoRoom sucessfully joined"}));
      return;
    }
   } catch (error) {
     ws.send(JSON.stringify({msg :"Internal server Error"}));
     return;
   }
}

function handleVideoUnsubscribeEvent(ws:WebSocket){
   try {
    const userdetails = userRoomMap.has(ws);
    if(!userdetails){
        ws.send(JSON.stringify({msg  :"user does not exist"}));
        return;
    }
    const videoId  = userRoomMap.get(ws);
    if(!videoId){
        ws.send(JSON.stringify({msg :"Video does not exist with this videoId"}));
        return;
    }
    let videoroom = videoRooms.get(videoId);
        videoroom =  videoroom?.filter((user)=>{
          return (user!=ws)
    })
    if(videoroom?.length === 0){
      videoRooms.delete(videoId);
    }
    else if(videoroom){
        videoRooms.set(videoId,videoroom);
    }
    ws.send(JSON.stringify({msg :"User unsubscribe the video successfully"}));
    return;
   } catch (error) {
    ws.send(JSON.stringify({msg :"Internal Server Error"}));
    return;
   }
}

function handleVideoTimeStampEvent(ws : WebSocket, timestamp : number){
    const videoId = userRoomMap.get(ws);
    if(!videoId){
        ws.send(JSON.stringify({msg :"THe user does not have any existing room"}))
        return;
    }
    const videoroom = videoRooms.get(videoId);

    // broadcast the new time stamp to all the user who are in the same room
    videoroom?.forEach((user)=>{
        if(user.readyState === OPEN){
            user.send(JSON.stringify({timeStamp : timestamp}));
        }
    })
}

async function handleWebsocketMessage(message : any, ws : WebSocket){
   message = JSON.parse(message.toString());
   const  type = message.type;
   const video_id = message.video_id;
   const timestamp = message.timestamp;


   switch (type) {
      case "video:subscribe":
        handleVideoSubscribeEvent(video_id,ws)
        break;
      case "video:unsubscribe" :
        handleVideoUnsubscribeEvent(ws)
        break;
      case "video:timestamp_updated" :
        handleVideoTimeStampEvent(ws,timestamp)
        default :
        console.log("something went wrong with ws");
    }

}

// async function handleCloseEvent(ws : WebSocket){
    
// }

wss.on('connection',(ws)=>{
     ws.send(JSON.stringify({msg :"connected to the ws sucessfully"}));
     ws.on('error',(error)=>console.log(error));
     ws.on('message',(message)=>{
        handleWebsocketMessage(message, ws);
     })
     ws.on('close',()=>{
        handleVideoUnsubscribeEvent(ws) //simply unsubscribe the user and don't show the current updates.
     })
})

server.listen(8080,()=>{
    console.log("Ws is listening on port 8080");
})