const http = require('http');
const webSocket = require('ws');
const request = require('request');

// Calling the API endpoint for LivePerson Demo
request.post('https://va.idp.liveperson.net/api/account/40912224/signup', (err, res, body) => {
  const livePerson_jwt_token = JSON.parse(res.body).jwt;
  // Passing in the JWT token into the WebSocket
  const ws = new webSocket ('wss://va.msg.liveperson.net/ws_api/account/40912224/messaging/consumer?v=3', {
    headers : {
      Authorization: "jwt " + livePerson_jwt_token
    }});
    // Requesting a new conversation
    ws.onopen = function(socket) {
      const newConversation = {
        "kind":"req",
        "id":1,
        "type":"cm.ConsumerRequestConversation"
      }
      ws.send(JSON.stringify(newConversation));
      console.log('Message sent, please check you LiveEngage ADMIN');
    };

    const sendMessage = (conId) => {
      return {
        "kind": "req",
        "id": 2,
        "type": "ms.PublishEvent",
        "body": { 
          "dialogId": conId,
          "event": {
            "type": "ContentEvent",
            "contentType": "text/plain",
            "message": "LivePerson Solutions Engineering, Tech interview message, Hello how are you doing?"
          }
        }
      }
    };
    
    ws.onmessage = function (evt) {
      const conId = JSON.parse(evt.data).body.conversationId;
      const message = sendMessage(conId);
      if (conId) {
        ws.send(JSON.stringify(message))
        ws.close()
      }
      ws.close()
    };
});