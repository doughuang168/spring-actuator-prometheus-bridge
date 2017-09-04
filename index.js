var express  = require('express');
var bodyParser 	= require('body-parser');
var methodOverride = require('method-override');
var agent = require("superagent");
var jsonfile = require('jsonfile');
var restapi = express();

var mappingFile = process.env.MAPPING_FILE;
var bridgePort  = process.env.BRIDGE_PORT;
var metricsHost = process.env.METRICS_HOST;
var metricsPort = process.env.METRICS_PORT;
var metricsPath = process.env.METRICS_PATH;
var metricsProto= process.env.METRICS_PROTO;

var mapFile = mappingFile;
var place= jsonfile.readFileSync(mapFile);
prometheus = {}
for(var exKey in place) {
    prometheus[place[exKey]['name']] =  {'map_to': place[exKey]['map_to'],'header_1': place[exKey]['header_1'], 'header_2': place[exKey]['header_2'], 'value': place[exKey]['value']};
}


//GET  
restapi.get('/metrics', function(req, res){
    
            agent
	       .get(metricsProto + '://' + metricsHost +':' + metricsPort +  '/'+ metricsPath )
                .then(function(resp) {

			metrics=resp.body;
			var data = '';

			for(var key in prometheus) {

 				data = data + prometheus[key]['header_1'] +'\n';
 				data = data + prometheus[key]['header_2'] +'\n';
 				data = data + prometheus[key]['map_to']+ ' ' + metrics[key] +'\n';
			}

    			// respond to request
    			res.setHeader('content-type', 'text/plain');
    			res.end(data);

                }, function(error) {
                        console.log(error);
                });
	
});


//This uses the Connect frameworks body parser to parse the body of the post request  
restapi.use(bodyParser.json());
restapi.use(methodOverride('_method'))
//restapi.listen(3000);
restapi.listen(bridgePort);
