var mongoose = require('mongoose');
var user = require('./user.js');
var Schema = mongoose.Schema;

var GrocerySchema= new Schema({
	itemName: {
		type: String,
		required: true,
		unique: true
	},
	completed: Boolean,
      date: String,
     users:[{user_id:{type:Schema.Types.ObjectId,ref:user}}]
});


module.exports=mongoose.model('grocery',GrocerySchema);