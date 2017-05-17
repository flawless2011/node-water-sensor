const twilio = require('twilio');
const crypto = require('crypto');
const base64 = require('base64-js');

const iv = Buffer.from(
  [
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01
  ]);
// TODO add real key
const key = Buffer.from(
  [
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
  ]);
const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

// TODO add sid and token
var accountSid = '';
var authToken = '';

var client = new twilio(accountSid, authToken);

var Alerts = module.exports;

Alerts.send = function(req, res) {
  console.log('req.body=' + req.body.payload);
  console.log('raw bytes=' + Buffer.from(base64.toByteArray(req.body.payload)).toString('hex'));
  decrypt(req.body.payload, 'base64');
};

var decrypt = function(text, encoding) {
  let decrypted = decipher.update(text, encoding, 'utf8');
  let payload = JSON.parse(decrypted.toString().substring(0, decrypted.indexOf('}') +1));
  sendTwilioSMS(payload.toNumber);
};

var sendTwilioSMS = function(toNumber) {
  client.messages.create({
    body: 'The water sensor detected WATER!',
    to: toNumber,
    from: '' // TODO add number
  }).then((message) => console.log(message.sid));
};
