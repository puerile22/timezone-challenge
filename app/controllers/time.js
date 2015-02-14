var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/answerbook-timezone');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Successfully connected to database');
});
var timeSchema = mongoose.Schema({
  id: Number,
  time: Date,
  UTCtime: String
});
var Time = mongoose.model('Time', timeSchema);
exports.getTime = function(req, res, next) {
  Time.find({id: req.params.id}, function(err, data) {
    console.log(data);
    if (err) {
      res.status(500);
      res.json({
        data: 'Error occured: ' + err 
      })
    } else if (data.length) {
      res.json({
        data: data
      })
    } else {
      res.json({
        data: 'Time: ' + req.params.id + ' not found'
      })
    }
  });
};
exports.createTime = function(req, res, next) {
  var time = new Time();
  time.id = req.params.id;
  time.time = new Date();
  time.UTCtime = req.params.UTCtime || "";
  time.save(function(err, data) {
    if (err) {
      res.status(500);
      res.json({
        data: 'Error occured: ' + err 
      })
    } else {
      res.json({
        data: data
      })
    }
  });
};
exports.deleteTime = function(req, res, next) {
  Time.remove({id: req.params.id}, function(err, data) {
    if (err) {
      res.status(500);
      res.json({
        data: 'Error occured: ' +err
      })
    } else {
      res.json({
        data: 'Time: ' + req.params.id + ' deleted successfully'
      })
    }
  });
};