

var express = require('express');
var app = express();
app.set('port', (process.env.PORT || 5000));
        app.use(function(req, res, next) {
      	  res.header("Access-Control-Allow-Origin", "*");
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH, OPTIONS');
      	  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Authorization,accept");
      	  next();
      	});

        app.use(function(req,res,next){
    var _send = res.send;
    var sent = false;
    res.send = function(data){
        if(sent) return;
        _send.bind(res)(data);
        sent = true;
    };
    next();
});

        // create our app w/ express
        var config      = require('./config/database'); // get db config file
        var User        = require('./models/user'); // get the mongoose model
var contacts = require('./models/test');
        var grocerydata= require('./models/grocerydata.js');//get the grocery Model

        var userlocation=require('./models/location.js');
        var passport	= require('passport');
        var jwt         = require('jwt-simple');
        var JwtStrategy=require('passport-jwt').Strategy;
        var mongoose = require('mongoose');                     // mongoose for mongodb
        var morgan = require('morgan');             // log requests to the console (express4)
        var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
        var methodOverride = require('method-override');// simulate DELETE and PUT (express4)
        var bcrypt=require('bcryptjs');
        // configuration =================

        //mongoose.connect('mongodb://node:nodeuser@mongo.onmodulus.net:27017/uwO3mypu');  // connect to mongoDB database on modulus.io
        
       //app.use(passport.initialize());
       app.use(passport.initialize());
    	
    //   app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
        app.use(morgan('dev'));                                         // log every request to the console
        app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
        app.use(bodyParser.json());                                     // parse application/json
        app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
        app.use(methodOverride());

      
       
        // listen (start app with node server.js) ======================================
        
     // routes ======================================================================

        // api ---------------------------------------------------------------------
        // get all todos
        
        mongoose.connect(config.database);

//var db=mongoose.createConnection('localhost','test');
//console.log(db);
var apiRoutes = express.Router();
     // pass passport for configuration
require('./config/passport')(passport);
      
     // bundle our routes
     
      
     // create a new user account (POST http://localhost:8080/api/signup)

apiRoutes.get('/getuserlocation',function(req,res){

userlocation.find(function(err,results){
  if(err){
    res.send(err);
  }
  else{
    res.json({success:true,data:results});
  }
});

})


//Register user locations
     apiRoutes.post('/registeruserocation',function(req,res){
      console.log('location registration');
        
var newlocation=new userlocation({
  Short_Name:req.body.Name,
  Full_Address:req.body.Description,
  Latitude:req.body.Latitude,
  Longitude:req.body.Longitude


});
newlocation.save(function(err){


  if (err) {
             return res.json({success: false, msg: 'Username already exists.'});
           }
           res.json({success: true, msg: 'Successfully saved new location.'});

});

     });
     apiRoutes.post('/signup', function(req, res) {
    	 console.log('entered');
       if (!req.body.email || !req.body.password) {
         res.json({success: false, msg: 'Please pass name and password.'});
       } else {
         var newUser = new User({
          fname:req.body.fname,
          lname:req.body.lname,
           email: req.body.email,
           password: req.body.password
         });
         // save the user
         newUser.save(function(err) {
           if (err) {
             return res.json({success: false, msg: 'Username already exists.'});
           }
           res.json({success: true, msg: 'Successful created new user.'});
         });
       }
     });
     apiRoutes.post('/authenticate', function(req, res) {
    	  User.findOne({
    	    email: req.body.email
    	  }, function(err, user) {
    	    if (err) throw err;

    	 
    	    if (!user) {

    	      res.send({success: false, msg: 'Authentication failed. User not found.'});
    	    } else {
    	      // check if password matches
    	    	console.log(user);
    	      user.comparePassword(req.body.password, function (err, isMatch) {
    	        if (isMatch && !err) {
    	          // if user is found and password is right create a token
    	          var token = jwt.encode(user, config.secret);
    	          // return the information including token as JSON
    	          res.json({success: true, token: 'JWT ' + token});
    	        } else {
    	          res.send({success: false, msg: 'Authentication failed. Wrong password.'});
    	        }
    	      });
    	    }
    	  });

    	});
     
     
     
     
     apiRoutes.get('/memberinfo', passport.authenticate('jwt', { session: false}), function(req, res) {
        console.log('inside memberinfo');
    	  var token = getToken(req.headers);
    	  if (token) {
            console.log('checking for token');
    	    var decoded = jwt.decode(token, config.secret);
    	    User.findOne({
    	      name: decoded.name
    	    }, function(err, user) {
    	        if (err) throw err;
    	 
    	        if (!user) {
    	          return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
    	        } else {
    	          res.json({success: true, msg: 'Welcome in the member area ' + user.name + '!'});
    	        }
    	    });
    	  } else {
    	    return res.status(403).send({success: false, msg: 'No token provided.'});
    	  }
    	});
    	 
    	getToken = function (headers) {
    	  if (headers && headers.authorization) {
    	    var parted = headers.authorization.split(' ');
    	    if (parted.length === 2) {
    	      return parted[1];
    	    } else {
    	      return null;
    	    }
    	  } else {
    	    return null;
    	  }    
    	};

apiRoutes.get('/userDetails',passport.authenticate('jwt', { session: false}),function(req,res){
var token=getToken(req.headers);
if(token){
    var decoded=jwt.decode(token,config.secret);
    User.findById(decoded._id,function(err,result){
        if(err)
            res.send({errmsg:'user Not Found !',error:err});
        else{
            //res.json(result);
			res.send({success:true,result:result})
        }
    })
}
else{
    res.send({msg:'could not authenticate !'});
}

});
apiRoutes.post('/updateUser',passport.authenticate('jwt',{session:false}),function(req,res){

var token=getToken(req.headers);
console.log(req.body.email);

console.log('update user');

if(token){
        console.log('update user1');
        var decoded =jwt.decode(token,config.secret);
        console.log(req.body.email);

        User.findOne(req.body.email,function(err,result){
        if(err){
throw err;
         }

if(!result){
    console.log('findOne result:'+result);

    res.send({success:false,msg:'Email Address is already Registered !'});

}
    else{

User.update({ _id:{$eq:decoded._id} },{ $set :{ 'email':req.body.email,'fname':req.body.fname,'lname':req.body.lname} },function(err,result){
if(err){
    res.send({success:false,msg:'Email already exists'});
}
else{
    res.send({success:true,msg:'Record updated successfully'});
}

});

    }

});

/*User.update({ _id:{$eq:req.params.id} },{ $set :  {fname:req.body.fname}  },  { $set : {lname:req.body.lname} },{ $set : {email:req.body.email} },function(err,result){
if(err){
    res.send({success:false,msg:'Error occured while updating '});
}
else{
    res.send({success:true,msg:'Record updated successfully'});
}

});*/


}
else{
    res.send({success:false,msg:'Not Authorize user try to Update'});

}

});

      
     // connect the api routes under /api/*
   


        
        
        
        
        
        
      /*  app.get('/login/credentials',function(req,res){
        	   console.log('fine');
      // var db=mongoose.createConnection('localhost','euro2016');
        var db=mongoose.createConnection('localhost','euro2016');
        var loginSchema=mongoose.Schema({
        	Email:String,
        	Password:String
        });
        
        var User=db.model('User',loginSchema);
        console.log('fine');
        db.once('open',function(){
        	console.log('entered');
        	User.find(function(err,results){
        		
        		if(err)
        			res.json(err);
        		else{
        			res.json(results);
        			console.log("REsult"+results);
        			mongoose.connection.close();
        		}
        	});
        	
        })
        
        });
        app.put('/api/register/user',function(req,res){
        	console.log(req.body.fname);
        	
        	var db=mongoose.createConnection('localhost','euro2016');
        	var Schema=mongoose.Schema;
        	var userSchema=new Schema({
        		First_Name:String,
        		Last_Name:String,
        		Email:{type:String,required:true,unique:true},
        		Password:{type:String,required:true}
        		
        	});
        	var User=db.model('User',userSchema);
        	
        	db.once('open',function(){
        		
        		User.create({
        			First_Name:req.body.fname,
        			Last_Name:req.body.lname,
        			Email:req.body.email,
        			Password:req.body.pwd
        		},function(err,results){
        			if(err)
        				res.json(err);
        			else{
        				res.json(results);
        				console.log(results);
        			}
        		})
        		
        	});
        	
        }); */

        apiRoutes.post('/showgroceries',function(req,res){
console.log(req.body._id);

 grocerydata.find({"users.user_id":req.body._id},function(err, results) {
            if (err)
                res.send(err)
            console.log(results);
            res.json({success:true,grocerydata:results});
        });
    });



       
        apiRoutes.get('/showallgroceries', function(req, res) {
            console.log('gro');

        	

	
	
	grocerydata.find(function(err,results) {
		 
         // if there is an error retrieving, send the error. nothing after res.send(err) will execute
         if (err)
             res.send(err);
         else{
        	 
         res.json({success:true,grocerydata:results});
         console.log(results);
         
        // return all todos in JSON format
         }
     });
                 // use mongoose to get all todos in the database
                  });

        // create todo and send back all todos after creation
        apiRoutes.post('/addgrocery', function(req, res) {

            // create a todo, information comes from AJAX request from Angular
console.log(req.body.item);
console.log(req.body._id);

/*contacts.findByIdAndUpdate(
        req.body._id,
        {$push: {"messages": {title: req.body.item, msg: req.body._id}}},
        {safe: true, upsert: true, new : true},
        function(err, model) {
            console.log(err);

        }
    );*/

   /*var doc= {$set : {name:req.body.item},
        $push: {"messages": {title:req.body.item, msg: req.body._id}}
    }


contacts.findOneAndUpdate(
  req.body._id,
   doc ,
    {safe: true, upsert: true},
    function(err, model) {
        console.log(err);
    }
);
*/
/*grocerydata.update({itemName:req.body.item},{$push:{"users":{user_id:req.body._id}}},function(err,results){
  if(err){
console.log('error while updating user ids');

  }
  else{
    console.log('updated successfully');
  }


    })*/
/*grocerydata.find({itemName:req.body.item},function(err,grocery){

    grocery.users.push(req.body._id);
    if(err)
    {
        console.log(err);
    }
    console.log('here');

*/
    //grocery.users.push({user_id:req.body._id});
   // console.log(grocery);
/*}

    )
*/







var docs=    {
        itemName : req.body.item,
        completed: true,
        date: new Date()
        
    }

	grocerydata.create(docs, function(err, results) {
        if (err){
            console.log('creation error');
           

           grocerydata.update({"users.user_id":{$ne:req.body._id}},{$push:{"users":{user_id:req.body._id}}},function(err,results){
  if(err){
console.log('error while updating user ids');
res.send(err);

  }
  else{
    console.log('updated successfully');


     grocerydata.find({"users.user_id":req.body._id},function(err, results) {
            if (err){
               
                console.log('find error');
                 res.send(err)
            }
          
            res.json({success:true,result:results});
            console.log('successfully sent results');
        });

  }


    })
      
        }

else{

     grocerydata.update({itemName:req.body.item},{$push:{"users":{user_id:req.body._id}}},function(err,results){
       if(err){
        console.log(err);
       }
       else{
        console.log('creation and upadted');
       }

    });

     grocerydata.find({"users.user_id":req.body._id},function(err, results) {
            if (err){
                res.send(err)
                console.log('find error');
            }
          
            res.json({success:true,result:results});
            console.log('successfully sent results');
        });


}        // get and return all the todos after you create another
      

        
    });


});
        	
        	       

     
        // delete a todo
        apiRoutes.post('/removeItem', function(req, res) {  	
        	
      
       	        console.log(req);
            	console.log(req.body.itemName);
                console.log(req.body._id);

/*var condition={$and:[{itemName:req.body.itemName},
{"users":{user_id:req.body._id}}]};*/

console.log('user passed');

            grocerydata.update({itemName:req.body.itemName},{$pull:{"users":{user_id:req.body._id}}},function(err,results){

                if(err){
                   res.send(err);
                        res.json({success:false,msg:'Record could not deleted'});
                }
                else{


 grocerydata.find({"users.user_id":req.body._id},function(err, results) {
            if (err)
                res.send(err)
            
                                console.log('deletedentry');
                                
                            res.json({success:true,result:results,msg:'Record Deleted Successfully'});
        });


                }

            })


/*req.body.users.forEach(function(item, index) {
  // `item` is the next item in the array
  // `index` is the numeric position in the array, e.g. `array[index] == item`
  console.log(item[index]);

});*/


            	/*grocerydata.remove({
                    _id : req.body._id
                }, function(err, todo) {
                    if (err){
                    	res.send(err);
                    	res.json({success:false,msg:'Record could not deleted'});
                    }
                        
                    else{
                    // get and return all the todos after you create another
                   grocerydata.find(function(err, results) {
                        if (err)
                            res.send(err)
                            else{ 
                            	console.log(results);
                            	console.log('deletedentry');
                            	
                            res.json({success:true,result:results,msg:'Record Deleted Successfully'});
                            }
                       
                    });
                   
                   

                    }
                });
            	*/
            });
        	//res.send('deleted');
        
             
        
       apiRoutes.put('/updategroceryitem/:id',function(req,res){
        	console.log(req.body.item);
        	console.log(req.params.id);
        	      		

        		grocerydata.update({ _id:{$eq:req.params.id} },{$set: {itemName:req.body.item}},function(err,results){
        			if(err)
        				console.log(err);
        			else{
        				
        				
        				console.log('success');
        				grocerydata.find(function(err,result){
        					if(err)
        						console.log(err);
        					else{

                                 //res.json({success: true, msg: 'updated successfully.'});
        						res.json(result);
        						
        					}
        				});
        		
        				
        			}
        		});
        		
        	});
        	
        	
    	

    
    // application -------------------------------------------------------------
    
       
    /*app.get('*', function(req, res) {
        res.sendfile('./public/index.html');
        // load the single view file (angular will handle the page changes on the front-end)
    console.log('Hello');
    });
    
*/   
     app.use('/api', apiRoutes);
   
   app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
   