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
  console.log(req.body.payload);
  decrypt(req.body.payload, 'base64');
};

var decrypt = function(text, encoding) {
  let decrypted = decipher.update(text, encoding, 'utf8');
  let decryptedText = decrypted.toString().substring(0, decrypted.indexOf('}') +1);
  console.log(decryptedText);
  let payload = JSON.parse(decryptedText);
  sendTwilioSMS(payload.toNumber);
};

var sendTwilioSMS = function(toNumber) {
  let msgBody = 'Water detected at ' + new Date().toLocaleTimeString({timeZone: 'America/Chicago'}) + ' Central time!';
  client.messages.create({
    body: msgBody,
    to: toNumber,
    from: process.env.FROM_PHONE
  }).then((message) => console.log(message.sid));
};
