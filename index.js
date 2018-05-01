const express = require('express');
const fb = require('facebook-chat-api');
const { RTMClient } = require('@slack/client');
const { email, password, slackToken, channel } = require('./config');

const APP = express();
const PORT = 8080;

fb({email: email, password: password}, function(err, api) {
  if (err) return;

  const rtm = new RTMClient(slackToken);
  rtm.start();

  api.listen(function(err, message) {
    if (err) console.error(err);
    if (message.threadID === '979768382099891') {
      let messageString = `${message.senderID}: ${message.body}`;
      rtm.sendMessage(messageString, channel)
      .then((res) => {

        console.log('Message sent: ', res.ts);
      })
      .catch(console.error);
      /*
        message = {
          type: 'message',
          senderID: '100005523279503',
          body: 'No they haven\'t talked to me',
          threadID: '100005523279503',
          messageID: 'mid.$cAAAAB0F6NDJpSlgOkljGRLBt3b4r',
          attachments: [],
          mentions: {},
          timestamp: '1525134050962',
          isGroup: false
        }
      */
      console.log(message);
    }
  })
});

APP.listen(PORT);
