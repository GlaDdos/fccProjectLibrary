/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;

const booksController = require('../controllers/booksController');

const MONGODB_CONNECTION_STRING = process.env.DB;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {

  app.route('/api/books')
    .get(booksController.getBooks)
    
    .post(booksController.postBook)
    
    .delete(booksController.deleteAllBooks);



  app.route('/api/books/:id')
    .get(booksController.getBook)
    
    .post(booksController.postComment)
    
    .delete(booksController.deleteBook);
  
};
