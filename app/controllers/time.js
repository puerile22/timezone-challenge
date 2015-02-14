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
  UTCtime: String,
});
var Time = mongoose.model('Time', timeSchema);

exports.getTime = function(req, res) {
  Time.find({id: req.params.id}, {id:1, time:1, UTCtime:1, _id:0}, function(err, data) {
    if (err) {
      res.status(500);
      res.json({
        data: 'Error occured: ' + err 
      })
    } else if (data.length) {
      data[0].time = new Date(data[0].time.getTime() + 3600000 * req.params.timezone);
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

exports.createTime = function(req, res) {
  if (req.params.UTCtime) {
    Time.findOneAndUpdate({id: req.params.id},{time: Date(), UTCtime: req.params.UTCtime}, {upsert: true}, 
    function(err, data) {
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
  } else {
    Time.findOneAndUpdate({id: req.params.id},{time: Date()}, {upsert: true}, function(err, data) {
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
  }
};

exports.deleteTime = function(req, res) {
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