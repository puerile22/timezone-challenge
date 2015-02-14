var restify = require('restify');
var fs = require('fs');
var controllers = {}
var controllers_path = process.cwd() + '/controllers';
fs.readdirSync(controllers_path).forEach(function(file) {
  if (file.indexOf('.js') != -1) {
    controllers[file.split('.')[0]] = require(controllers_path + '/' + file)
  }
});
var server = restify.createServer({name: 'answerbook-timezone'});
server.use(restify.fullResponse());
server.use(restify.bodyParser());

server.get('/time/get/:id/:timezone', controllers.time.getTime);
server.post('/time/set', controllers.time.createTime);
server.put('/time/set/:id', controllers.time.createTime);
server.put('/time/set/:id/:UTCtime', controllers.time.createTime);
server.del('/time/delete/:id', controllers.time.deleteTime);
var port = process.env.PORT || 8080;
server.listen(port, function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log('%s listening at %s', server.name, server.url);
  }
});