var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var product = new Schema({
    title: String,
    price: Number,
    likes: {type:Number, default:0}
    // only these properties that can be saved in this db model
});

module.exports = mongoose.model('Product',product); //Product > name of the database model 

