const mongoose = require('mongoose');

var schema = new mongoose.Schema({
    title : {
        type : String,
        required: true
    },
    article_body : {
        type: String,
        required: true,
    },
    author : {
        type: String,
        required: true,
    },
    publish_date : {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
  
})

const Userdb = mongoose.model('newsarticles', schema);

module.exports = Userdb;