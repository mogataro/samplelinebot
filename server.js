'use strict';

require('dotenv').config();

const express = require('express');
const line = require('@line/bot-sdk');
const PORT = process.env.PORT || 3000;

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
}
const app = express();
const axios = require('axios');

app.post('/webhook', line.middleware(config), (req, res) => {
    Promise
      .all(req.body.events.map(handleEvent))
      .then((result) => res.json(result));
});

const client = new line.Client(config);

function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }
  if (
    event.message.text === '胡散臭い' ||
    event.message.text === 'うさん臭い' ||
    event.message.text === 'うさんくさい'
  ) {
    let roomId = event.source.roomId
    client.replyMessage(event.replyToken, {
      type: 'text',
      text: 'もっと構ってょ'
    })
    console.log(config.channelAccessToken)
    axios.post(
      `https://api.line.me/v2/bot/room/${roomId}/leave`,
      '',
      {
        headers: {
          'Authorization': `Bearer {${config.channelAccessToken}}`
        }
      }
    )
    return
  }

  let names = [];
  let promise = axios.get(encodeURI(process.env.baseURL + event.message.text))
  promise.then(
    function(res) {
      res.data.results.shop.forEach(function(shop){
        names.push(shop.name);
      })
      return client.replyMessage(event.replyToken, {
        type: 'text',
        text: names[0]
      })
    }
  ).catch(function(error){ // 取得失敗時の処理
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: '何言ってるかわからないけど愛してる！'
    })
  });
}

app.listen(PORT);