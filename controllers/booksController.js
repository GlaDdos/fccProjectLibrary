const MongoClient = require('mongodb');
const ObjectID = require('mongodb').ObjectID;


const CONNECTION_STRING = process.env.DB;
const COLLECTION = 'books';


exports.postBook = function (req, res) {
  const title = req.body.title;

  if(title == undefined) {
    res.status(200).send('missing required data');
    return;
  }

  MongoClient.connect(CONNECTION_STRING)
    .then( db => {
      return db.collection(COLLECTION).insertOne({
        title: title,
        comments: []
      });
    })
    .then( doc => {
      res.status(200).send(doc.ops[0]);

    })
    .catch(err => {
      console.dir(err);
      res.status(500).send({status: 'database error'});
    });
}

exports.getBook = function (req, res) {
  
  const bookId = req.params.id;

  MongoClient.connect(CONNECTION_STRING)
    .then( db => {
      return db.collection(COLLECTION).findOne(
        {_id: new ObjectID(bookId)}
      );
    })
    .then( doc => {
      if(doc == null) {
        res.status(200).send({status: "Requested book doesn't exist in database"})
        return;
      }
      res.status(200).send(doc);
    })
    .catch( err => {
      console.dir(err);
      res.status(500).send({status: 'database error'});
    });
}

exports.getBooks = function (req, res) {

  MongoClient.connect(CONNECTION_STRING)
    .then( db => {
      return db.collection(COLLECTION).find({});
    })
    .then ( cursor => {
      return cursor.toArray();
    })
    .then( arr => {
      let responseArray = arr.map( item => {
        return { _id: item._id, title: item.title, commentcount: item.comments.length}
      })

      res.status(200).send(responseArray);
    })
    .catch( err => {
      console.dir(err);
      res.status(500).send({status: 'database error'});
    })
}

exports.postComment = function(req, res) {
  const bookId = req.params.id;
  const comment = req.body.comment;

  MongoClient.connect(CONNECTION_STRING)
    .then( db => {
      return db.collection(COLLECTION).findOneAndUpdate(
        {_id: new ObjectID(bookId)},
        { $push: { comments: comment}},
        { returnOriginal: false }
      )
    })
    .then( doc => {
      res.status(200).send(doc.value);
    })
    .catch( err => {
      console.dir(err);
      res.status(500).send({status: 'database error'});
    });

}

exports.deleteBook = function(req, res) {
  const bookId = req.params.id;

  MongoClient.connect(CONNECTION_STRING)
    .then( db => {
      return db.collection(COLLECTION).findOneAndDelete({_id: new ObjectID(bookId) });
    })
    .then( result => {
      if(result.value !== null) {
        res.status(200).send('delete successful');

      } else {
        res.status(200).send('no book exists');

      }
    })
    .catch( err => {
      console.dir(err);
      res.status(500).send({status: 'database error'});
    });
}

exports.deleteAllBooks = function (req, res) {

  MongoClient.connect(CONNECTION_STRING)
    .then( db => {
      return db.collection(COLLECTION).deleteMany({});

    })
    .then( result => {
        res.status(200).send('complete delete successful');
    })
    .catch( err => {
      console.dir(err);
      res.send(500).send({status: 'database error'});
    })
}