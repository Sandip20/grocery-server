var cool = require('cool-ascii-faces');
var express = require('express');
var app = express();

var apiRoutes = express.Router();

app.set('port', (process.env.PORT || 5000));

//app.use(express.static(__dirname + '/public'));

// views is directory for all template files

apiRoutes.get('/cool', function(request, response) {
  response.send(cool());
});

app.use('/api', apiRoutes);

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});