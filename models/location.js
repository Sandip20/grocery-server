var mongoose= require('mongoose');
var Schema=mongoose.Schema;
var locationSchema= new  Schema({
	Short_Name:{
		type:String
	},
	Full_Address:{
		type:String,
		required:true
	},
	Longitude:{
		type:Number,
		required:true,

	},
	Latitude:{
		type:Number,
		required:true,

	}

})
module.exports=mongoose.model('location',locationSchema);