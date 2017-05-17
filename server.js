var express = require('express');
var app = express();
var alertsResource = require('./service/alerts');
var bodyParser = require('body-parser');

app.set('port', (process.env.PORT || 8080));

app.use(bodyParser.json());

// Alerts
app.post('/api/alerts', alertsResource.send);

app.listen(app.get('port'), function() {
  console.log('Node up and running on port %d Captain!', app.get('port'));
});
