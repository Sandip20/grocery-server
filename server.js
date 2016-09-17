// set up ========================
        var express  = require('express');
        var app      = express();  
        var apiRoutes = express.Router();
            
        apiRoutes.get('/open',function (req,res) {

        res.send('hellop');
        });
        app.use('/api', apiRoutes);

    
    app.listen(8081);
        console.log("App listening on port 8081");    

