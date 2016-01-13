var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');
var mongoose = require('mongoose');

var config = require('config');

var dbConfig = config.get('MongoLab');



var dbString = "mongodb://"+ dbConfig.user.username + ":" +  dbConfig.user.password + "@" + dbConfig.database.url  + ":" + dbConfig.database.port + "/" + dbConfig.database.name;
console.log('-------------------')
console.log('dbString');
console.log(dbString);
console.log('-------------------')

mongoose.connect(dbString);

//object model for our custom object with id and color
var DBObject = mongoose.model('Object', { _id: String , color: String });


//use id as uuid -> uuid.v4();


/* GET users listing. */
router.get('/', function(req, res, next) {

  console.log('Querying database for all objects');
  DBObject.find(function(err, dbObjects){

    if(err){
      console.log(err);
      res.status(500).send('Error on the server side');
      return;
    }
    console.log('Found ' + dbObjects.length + ' dbobjects');
    console.log(dbObjects);
    res.send(dbObjects);
  });
});


router.post('/', function(req, res, next) {
  if(req.body == null || !req.body.color){
    res.status(400).send();
    return;
  }

  var color = req.body.color;
  console.log('color from client ' + color);

  //var fluffy = new Kitten({ name: 'fluffy' });
  var newObject = new DBObject({ _id : uuid.v4(), color: color });

  newObject.save(function (err, savedObject) {
    if(err){
      console.log('error while saving to database');
      console.log(err);
      res.status(500).send('Error on the server side');
      return;
    }
    console.log('saved object with id ' + savedObject._id);
    res.send(savedObject);
  })
});


router.put('/', function(req, res, next) {

  if(req.body == null || !req.body.color || !req.body._id){
    res.status(400).send();
    return;
  }


  var id = req.body._id;
  var newColor = req.body.color;

  console.log('id from client ' + id);

  DBObject.findById(id, function(err, objectFromDB){
    if(err){
      console.log('error while finding form database id ' + id);
      console.log(err);
      res.status(500).send('Error on the server side');
      return;
    }

    if(objectFromDB == null){
      console.log('No object with id ' + id + ' found in database');
      res.status(404).send();
      return;
    }

    objectFromDB.color = newColor;

    objectFromDB.save(function (err, updatedObject) {
      if(err){
        console.log('error while storing updated object to database id ' + id);
        console.log(err);
        res.status(500).send('Error on the server side');
        return;
      }
      console.log('object updated with id ' + id);
      res.send(updatedObject);

    });


  });

});




module.exports = router;
