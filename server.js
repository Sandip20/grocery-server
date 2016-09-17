// set up ========================
        var express  = require('express');
        var app      = express();    
        app.get('/open',function (req,res) {

        res.json({Success:'true'});
        })
        

     app.use('/api', apiRoutes);
    app.listen(8081);
    console.log("App listening on port 8081");    