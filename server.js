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

// const router = express.Router();
// const restFacade= require('./rest-facade');

// app.get('/', (req, res) => res.send('Hello LINE BOT!'));
app.post('/webhook', line.middleware(config), (req, res) => {
    // console.log(req.body.events);
    Promise
      .all(req.body.events.map(handleEvent))
      .then((result) => res.json(result));
});

const client = new line.Client(config);

function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }
  // console.log(encodeURI(process.env.baseURL + event.message.text));

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
        // text: event.message.text + '大好き'//実際に返信の言葉を入れる箇所
      })
    }
  ).catch(function(error){ // 取得失敗時の処理
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: '何言ってるかわからないけど愛してる！'
      // text: event.message.text + '大好き'//実際に返信の言葉を入れる箇所
    })
  });
}

app.listen(PORT);
// console.log(`Server running at ${PORT}`);