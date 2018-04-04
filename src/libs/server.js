
import {Text, Encrypt} from './messages';
import WechatCrypto from 'wechat-crypto';
import {parseString} from 'xml2js';
import {log, createHash, getTimestamp, randomString, isString, isArray} from '../utils';
import Core from './core';

const init = function (instance) {
  $server_handler = function () {};
};

let $server_handler;
let $server_message;

const setMessageHandler = function (handler) {
  if (typeof handler != 'function') handler = function () {};
  $server_handler = handler;
};

const getAvailableNews = function (arr) {
  let list = [];
  let response = null;
  for (let i in arr) {
    if (arr[i].dataParams.MsgType == 'news') {
      response = arr[i];
      list.push(arr[i].dataParams.Articles.item);
    }
  }
  if (list.length > 0 && response) {
    response.dataParams.ArticleCount = list.length;
    response.dataParams.Articles.item = list;
  }
  return response;
}

const serve = async function () {
  let instance = Core.getInstance();
  let app = instance.$config.app;
  if (!app) {
    throw new Error('未在配置文件中设置应用服务器');
    return;
  }
  let crypto = null;
  if (instance.$config.aesKey) {
    crypto = new WechatCrypto(instance.$config.token, instance.$config.aesKey, instance.$config.appKey);
  }
  if (app.getMethod() == 'GET') {
    let query = app.getQuery();
    if (!query.signature || !query.echostr || !query.timestamp || !query.nonce) {
      app.sendResponse('Hello node-easywechat');
      return;
    }
    let sign;
    if (crypto) {
      sign = crypto.getSignature(query.timestamp || '', query.nonce || '', query.encrypt || '');
    }
    else {
      var sign_data = [instance.$config.token, query.timestamp || '', query.nonce || '', query.encrypt || ''].sort();
      sign = createHash(sign_data.join(''), 'sha1');
    }
    if (sign === query.signature) {
      app.sendResponse(query.echostr);
    }
    else {
      app.sendResponse('fail');
    }
  }
  else {
    let xml = await app.getBody();
    $server_message = await parseMessage(xml, crypto);
    if ($server_handler && typeof $server_handler == 'function') {
      let result = await $server_handler($server_message);

      if (!result || (isString(result) && result.toUpperCase() == 'SUCCESS')) {
        app.sendResponse('SUCCESS');
        return;
      }
      let response = null;
      if (isString(result)) {
        response = new Text({content: result});
      }
      else if (isArray(result)) {
        response = getAvailableNews(result);
      }
      else {
        response = result;
      }

      if (response && typeof response == 'object') {
        response.setAttribute('ToUserName', $server_message.FromUserName);
        response.setAttribute('FromUserName', $server_message.ToUserName);
        let data = response.getData();
        log('server.send().original', data);
        if (crypto && $server_message._isEncrypt) {
          data = crypto.encrypt(data);
          let timestamp = getTimestamp();
          let nonce = randomString();
          let sign = crypto.getSignature(timestamp, nonce, data);
          response = new Encrypt({
            encrypt: data,
            sign,
            timestamp,
            nonce
          });
          data = response.getData();
          log('server.send().encrypt', data);
        }
        app.sendResponse(data);
      }
    }
  }
};

const parseMessage = async function (xml, crypto = null) {
  return new Promise((resolve, reject) => {
    parseString(xml, async (err, result) => {
      if (err) {
        reject(err);
      }
      else {
        let message
        if (result && result.xml) {
          message = {}
          for (let k in result.xml) {
            message[k] = result.xml[k][0];
          }
          message._isEncrypt = false;
          if (message.Encrypt && crypto) {
            let decrypted = crypto.decrypt(message.Encrypt);
            log('parseMessage.decrypted', decrypted);
            message = await parseMessage(decrypted.message);
            if (!message) {
              throw new Error('无法解密消息，请确认 AppId、Token、AESKey 等是否正确');
            }
            else {
              message._isEncrypt = true;
            }
          }
        }
        resolve(message);
      }
    })
  })
  .catch((err) => {
    log('server.parseMessage()', err)
  });
};

const getMessage = function () {
  return $server_message;
};

export default {
  init,
  setMessageHandler,
  serve,
  getMessage
};
