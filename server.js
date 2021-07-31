const express = require('express');
const bodyParser= require('body-parser');
const MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');

const app = express();
app.set('view engine', 'ejs');

const baseURL = 'mongodb+srv://ashar:ashar@cluster0.qp0tx.mongodb.net/quotes?retryWrites=true&w=majority';
const url = process.env.MONGODB_URI || baseURL;

MongoClient.connect(url, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to MongoDB!');
    const db = client.db('quotes');

    app.use(express.static(__dirname + '/public'));
    app.use(bodyParser.json());

    app.use(bodyParser.urlencoded({ extended: true }));

    app.listen(3000, function () {
    console.log("Listening on PORT 3000");
    });

    app.get('/', (req,res) => {
        const allQuotes = db.collection('quotes').find().toArray()
        .then(results => {
            res.render("index.ejs", {quotes: results} )
        })
        .catch(error => console.error(error));
    });

    app.post('/quotes', (req,res) => {
        const allQuotes = db.collection('quotes');
        allQuotes.insertOne(req.body)
            .then(result => {
                res.redirect('/');
            })
            .catch(error => console.error(error))
    });

    app.put('/quotes', (req,res) => {
        const allQuotes = db.collection('quotes');

        allQuotes.findOneAndUpdate(
            { name: req.body.name},
            {$set: {
                quote: req.body.quote
            }},
            {upsert: true}
        )
        .then(results => {res.json('Success')})
        .catch(error => console.error(error));
    });

    app.delete('/quotes', (req,res) => {
        const allQuotes = db.collection('quotes');
        allQuotes.deleteOne(
            { name: req.body.name }
        )
        .then(results => {
            if (results.deletedCount === 0) {
                return res.json("No more quotes to delete");
            }
            res.json("Deleted quote")
        })
        .catch(error => console.error(error))
    });

  })
   .catch(console.error)
