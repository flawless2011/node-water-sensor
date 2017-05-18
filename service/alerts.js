const twilio = require('twilio');
const crypto = require('crypto');
const base64 = require('base64-js');

const iv = Buffer.from(
  [
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01
  ]);

const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(process.env.AES_256_KEY), iv);

var client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

var Alerts = module.exports;

Alerts.send = function(req, res) {
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
    from: process.env.FROM_PHONE
  }).then((message) => console.log(message.sid));
};
