require('dotenv').config();

// axios を require してインスタンスを生成する
const axiosBase = require('axios');
// const axios = axiosBase.create({
//   baseURL: process.env.baseURL, // apiのURL
//   headers: {
//     'Content-Type': 'application/json',
//     'X-Requested-With': 'XMLHttpRequest'
//   },
//   responseType: 'json'
// });

/**
 * REST-API の GET メソッドを実行する
 *
 * @param {any} url REST-API のURL
 * @param {any} callback 呼び出し元のコールバック処理
 * @param {any} [option=null] axios のオプション
 */
function get(url, callback, option = null) {
  // axios を使って引数で指定された url に対してリクエストを投げる
  axiosBase.get(url, option)
  .then(function(response) {
    // 返ってきたレスポンスはそのまま加工せずに callback で呼び出し元へ渡す
    console.log(response);
    callback(response);
  })
  .catch(function(error) {
    console.log('ERROR!! occurred in Backend.')
  });
}

/**
 * コンストラクタ
 */
function RestFacade() {}

// prototype チェインに突っ込む
RestFacade.prototype.get = get;

module.exports = new RestFacade();