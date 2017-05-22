const twilio = require('twilio');
const crypto = require('crypto');
const base64 = require('base64-js');

const iv = Buffer.from(
  [
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01
  ]);

var client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

var Alerts = module.exports;

Alerts.send = function(req, res) {
  console.log(req.body.payload);
  decrypt(req.body.payload, 'base64');
  res.status(200).send({status: "OK"});
};

var decrypt = function(text, encoding) {
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(process.env.AES_256_KEY), iv);
  decipher.setAutoPadding(false);
  let decrypted = decipher.update(text, encoding, 'utf8');
  decrypted += decipher.final('utf8');
  // String will always be of length 32 due to encryption padding so we need to strip off null characters at end
  decrypted = decrypted.substring(0, decrypted.lastIndexOf('}') + 1);
  console.log(decrypted);
  let payload = JSON.parse(decrypted);
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
