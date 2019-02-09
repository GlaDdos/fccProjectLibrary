const MongoClient = require('mongodb');
const ObjectID = require('mongodb').ObjectID;


const CONNECTION_STRING = process.env.DB;
const COLLECTION = 'books';


exports.postBook = function (req, res) {
  const title = req.body.title;

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
        return { _id: item._id, title: item.title, commentCount: item.comments.length}
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