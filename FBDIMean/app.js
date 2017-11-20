var express = require('express');
var app = express();
bodyParser=require('body-parser');

var methods= require('./methods/soap.methods');
var config= require('./public/config');

//methods.getJobStatus('1299097');
//methods.downloadESSJobExecutionDetails('1299097');
//methods.uploadFileToUcm('D:\\UI Development\\Node\\FBDI MEAN Stack\\abc.zip', 'abc12.zip', 'zip', 'abc12', 'abc12',
//               'scm_impl', 'scm/inventoryTransaction/import', 'FAFusionImportExport');
//methods.submitEssJobStatus('oracle/apps/ess/financials/commonModules/shared/common/interfaceLoader',
//                    'InterfaceLoaderController','33', '2348885');

//cors error resolution

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//to parse json
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

var appRouter = require('./routes/soap.ws')();
app.use("/api",appRouter);

app.get("/",function(req,res){
    res.send("<h2>Hi,<br> Welcome to WS API</h2><br><h3><a href='http://localhost:3000/api/getStatus'>Get Status</a></h3>");
});

app.listen(config.PORT, function(){
  console.log("Server started on port : "+config.PORT);
});
