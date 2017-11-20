var config= require('../public/config');
var request = require('request');
var soap = require('soap');
var fs= require('fs');

function soap_request(){
  var url = config.URL+'/publicFinancialCommonErpIntegration/ErpIntegrationService?WSDL';
  let request_with_defaults = request.defaults({
    'proxy': 'http://10.76.242.101:80',//'http://10.74.91.103:80',
    'timeout': 50000,
    'connection': 'keep-alive',
    'Content-Type': 'text/xml;charset=UTF-8',
    'gzip': true,
    'deflate': true
  });
  var auth = "Basic " + new Buffer( config.USERNAME + ":" + config.PASSWORD ).toString('base64');
  return [url,request_with_defaults,auth];
}

module.exports = {

  getJobStatus : function (requestIdInput) {
      soap_param= soap_request();
      var url= soap_param[0];
      let request_with_defaults = soap_param[1];
      var auth = soap_param[2];

      let soap_client_options = {
        'request': request_with_defaults,
        overridePromiseSuffix: 'getESSJobStatus'
      };

      var args = {
        requestId: requestIdInput//'1406303' //eneter request is and check by running the program
      };
      soap.createClient(url, soap_client_options , function(err, client) {
        if(err){
          console.log('Unable to connect to cloud. Maybe authentication header has some problems.');
          console.log(err);
          return;
        }
        client.addHttpHeader('Authorization', auth);
    	  //client.setSecurity(new soap.BasicAuthSecurity('fin_impl', 'yLx95345'));

    	  client.getESSJobStatus(args, function(err, result) {
            if(err){
        			console.log('Error occured');
              return;
        		}
    		    console.log(result);
            fs.writeFileSync('./result/getESSJobStatus.json',JSON.stringify(result));
            fs.writeFileSync('./result/getjob client last request.XML', client.lastRequest);
            console.log('Successful soap request.');
        });

      });
  },

  getJobStatusTemp : function (requestIdInput,callback) {
      soap_param= soap_request();
      var url= soap_param[0];
      let request_with_defaults = soap_param[1];
      var auth = soap_param[2];

      let soap_client_options = {
        'request': request_with_defaults,
        overridePromiseSuffix: 'getESSJobStatus'
      };

      var args = {
        requestId: requestIdInput//'1406303' //eneter request is and check by running the program
      };
      soap.createClientAsync(url, soap_client_options ).then((client)=>{
          
      }).then((result) => {
          console.log(result);
      });



       function(err, client) {
        if(err){
          console.log('Unable to connect to cloud. Maybe authentication header has some problems.');
          console.log(err);
          return;
        }
        client.addHttpHeader('Authorization', auth);
        //client.setSecurity(new soap.BasicAuthSecurity('fin_impl', 'yLx95345'));

        client.getESSJobStatus(args, function(err, result) {
            if(err){
              console.log('Error occured');
              return;
            }
            console.log(result);
            fs.writeFileSync('./result/getESSJobStatus.json',JSON.stringify(result));
            fs.writeFileSync('./result/getjob client last request.XML', client.lastRequest);
            console.log('Successful soap request.');
        });

      });
  },

  submitEssJobStatus: function (jobPackageInput, jobNameInput, paramListInput){
    soap_param= soap_request();
    var url= soap_param[0];
    let request_with_defaults = soap_param[1];
    var auth = soap_param[2];

    let soap_client_options = {
      'request': request_with_defaults,
      overridePromiseSuffix: 'submitESSJobRequest'
    };
    var args = {
      jobPackageName : jobPackageInput,
      jobDefinitionName : jobNameInput,
      paramList : paramListInput
    };
    soap.createClient(url, soap_client_options , function(err, client) {
      if(err){
        console.log('Unable to connect to cloud. Maybe authentication header has some problems.');
        console.log(err);
        return;
      }
      client.addHttpHeader('Authorization', auth);
      //client.setSecurity(new soap.BasicAuthSecurity('fin_impl', 'yLx95345'));

      client.submitESSJobRequest(args, function(err, result) {
          if(err){
            console.log('Error occured');
          }
          //console.log(result);
          fs.writeFileSync('./result/submitESSJobRequest.json',JSON.stringify(result));/*, function (err) {
              if (err)
                  return console.log(err);
              console.log('Successful soap request.');
          });*/
          console.log('Successful soap request.');
      });

    });

  },

  uploadFileToUcm: function(fileLocation, fileName, contentType, docTitle, docName,
                            docAuthor, ucmAccountInfo, ucmSecurityGroup) {
      soap_param= soap_request();
      var url= soap_param[0];
      let request_with_defaults = soap_param[1];
      var auth = soap_param[2];

      let soap_client_options = {
        'request': request_with_defaults,
        escapeXML:false,
        overridePromiseSuffix: 'uploadFileToUcm'
      };

      var byteArray = fs.readFileSync(fileLocation).toString('base64');;
      fs.writeFileSync('./result/uploadFileToUcm byte code.txt',byteArray);

      var args = {
        "document": "<erp:Content xmlns:erp=\"http://xmlns.oracle.com/apps/financials/commonModules/shared/model/erpIntegrationService/\" >"
      			+byteArray
      			+"</erp:Content> <erp:FileName xmlns:erp=\"http://xmlns.oracle.com/apps/financials/commonModules/shared/model/erpIntegrationService/\" >"
      			+fileName
      			+"</erp:FileName> <erp:ContentType xmlns:erp=\"http://xmlns.oracle.com/apps/financials/commonModules/shared/model/erpIntegrationService/\" >"
      			+contentType
      			+"</erp:ContentType> <erp:DocumentTitle xmlns:erp=\"http://xmlns.oracle.com/apps/financials/commonModules/shared/model/erpIntegrationService/\" >"
      			+docTitle
      			+"</erp:DocumentTitle> <erp:DocumentAuthor xmlns:erp=\"http://xmlns.oracle.com/apps/financials/commonModules/shared/model/erpIntegrationService/\" >"
      			+docAuthor
      			+"</erp:DocumentAuthor> <erp:DocumentSecurityGroup xmlns:erp=\"http://xmlns.oracle.com/apps/financials/commonModules/shared/model/erpIntegrationService/\" >"
      			+ucmSecurityGroup
      			+"</erp:DocumentSecurityGroup> <erp:DocumentAccount xmlns:erp=\"http://xmlns.oracle.com/apps/financials/commonModules/shared/model/erpIntegrationService/\" >"
      			+ucmAccountInfo
      			+"</erp:DocumentAccount> <erp:DocumentName xmlns:erp=\"http://xmlns.oracle.com/apps/financials/commonModules/shared/model/erpIntegrationService/\" >"
      			+docName
      			+"</erp:DocumentName>"
      }
      var resultD;
      soap.createClient(url, soap_client_options , function(err, client) {
        if(err){
          console.log('Unable to connect to cloud. Maybe authentication header has some problems.');
          console.log(err);
          return;
        }
        client.addHttpHeader('Authorization', auth);
        client.addHttpHeader('Content-Length', args.length);

    	  client.uploadFileToUcm(args, function(err, result) {
            if(err){
              console.log(err);
              fs.writeFileSync('./result/uploadFileToUcm error.json',JSON.stringify(err));
              console.log('Error occured');
              fs.writeFileSync('./result/uploadFileToUcm client last request.XML', client.lastRequest);
              throw err;
              resultD="Error in request. Error: "+err;
            }else{
            console.log(result);
            fs.writeFileSync('./result/uploadFileToUcm.json',JSON.stringify(result));
            console.log('Successful soap request.');
            resultD="Successful soap request. Result : "+result;
           }
        });

      });
      return resultD;
  },

  downloadESSJobExecutionDetails: function(requestIdInput) {
      soap_param= soap_request();
      var url= soap_param[0];
      let request_with_defaults = soap_param[1];
      var auth = soap_param[2];

      let soap_client_options = {
        'request': request_with_defaults,
        overridePromiseSuffix: 'downloadESSJobExecutionDetails'
      };

      var args = {
        requestId : requestIdInput,//'1406303' //eneter request is and check by running the program
        fileType : 'zip'
      };

      soap.createClient(url, soap_client_options , function(err, client) {
        if(err){
          console.log('Unable to connect to cloud. Maybe authentication header has some problems.');
          console.log(err);
          return;
        }
        client.addHttpHeader('Authorization', auth);
    	  //client.setSecurity(new soap.BasicAuthSecurity('fin_impl', 'yLx95345'));

    	  client.downloadESSJobExecutionDetails(args, function(err, result) {
            if(err){
        			console.log('Error occured');
              console.log(err);
              return;
        		}

    		    console.log(result);
            fs.writeFileSync('./result/downloadESSJobExecutionDetails.json',JSON.stringify(result));
            fs.writeFileSync('./result/result.json',result.result[0].Content.Include.body);
            fs.writeFileSync('./result/resultJ.json',JSON.stringify(result.result[0].Content.Include.body));
            console.log('Successful soap request.');
        });

      });
  }

}




/*
//1
// function getJobStatus(requestIdInput) {
//     soap_param= soap_request();
//     var url= soap_param[0];
//     let request_with_defaults = soap_param[1];
//     var auth = soap_param[2];
//
//     let soap_client_options = {
//       'request': request_with_defaults,
//       overridePromiseSuffix: 'getESSJobStatus'
//     };
//
//     var args = {
//       requestId: requestIdInput//'1406303' //eneter request is and check by running the program
//     };
//     soap.createClient(url, soap_client_options , function(err, client) {
//       if(err){
//         console.log('Unable to connect to cloud. Maybe authentication header has some problems.');
//         console.log(err);
//         return;
//       }
//       client.addHttpHeader('Authorization', auth);
//   	  //client.setSecurity(new soap.BasicAuthSecurity('fin_impl', 'yLx95345'));
//
//   	  client.getESSJobStatus(args, function(err, result) {
//           if(err){
//       			console.log('Error occured');
//             return;
//       		}
//   		    console.log(result);
//           fs.writeFileSync('getESSJobStatus.json',JSON.stringify(result));
//           fs.writeFileSync('getjob client last request.XML', client.lastRequest);
//           console.log('Successful soap request.');
//       });
//
//     });
// }

//2
function submitEssJobStatus(jobPackageInput, jobNameInput, paramListInput){
  soap_param= soap_request();
  var url= soap_param[0];
  let request_with_defaults = soap_param[1];
  var auth = soap_param[2];

  let soap_client_options = {
    'request': request_with_defaults,
    overridePromiseSuffix: 'submitESSJobRequest'
  };
  var args = {
    jobPackageName : jobPackageInput,
    jobDefinitionName : jobNameInput,
    paramList : paramListInput
  };
  soap.createClient(url, soap_client_options , function(err, client) {
    if(err){
      console.log('Unable to connect to cloud. Maybe authentication header has some problems.');
      console.log(err);
      return;
    }
    client.addHttpHeader('Authorization', auth);
    //client.setSecurity(new soap.BasicAuthSecurity('fin_impl', 'yLx95345'));

    client.submitESSJobRequest(args, function(err, result) {
        if(err){
          console.log('Error occured');
        }
        //console.log(result);
        fs.writeFileSync('submitESSJobRequest.json',JSON.stringify(result));/*, function (err) {
            if (err)
                return console.log(err);
            console.log('Successful soap request.');
        });
        console.log('Successful soap request.');
    });

  });

}

//3
function uploadFileToUcm(fileLocation, fileName, contentType, docTitle, docName,
                          docAuthor, ucmAccountInfo, ucmSecurityGroup) {
    soap_param= soap_request();
    var url= soap_param[0];
    let request_with_defaults = soap_param[1];
    var auth = soap_param[2];

    let soap_client_options = {
      'request': request_with_defaults,
      overridePromiseSuffix: 'uploadFileToUcm',
      wsdl_headers: { 'Authorization': auth }
    };

    var byteArray = fs.readFileSync(fileLocation).toString('base64');;
    fs.writeFileSync('uploadFileToUcm byte code.txt',byteArray);

    var args2 = { _xml : "<typ:uploadFileToUcm xmlns:typ=\"http://xmlns.oracle.com/apps/financials/commonModules/shared/model/erpIntegrationService/types/\">"
                        +"    <typ:document xmlns:typ=\"http://xmlns.oracle.com/apps/financials/commonModules/shared/model/erpIntegrationService/types/\">"
                        +"            <erp:Content  xmlns:erp=\"http://xmlns.oracle.com/apps/financials/commonModules/shared/model/erpIntegrationService/\">"
                        +"UEsDBBQAAAAIAAuEaEue7VBfgQAAAGoBAAAcAAAASW52VHJhbnNhY3Rpb25zSW50ZXJmYWNlLmNzdvPMK0vNK8kvqlTwL0pXCA021AEBIBlgYGBsYGQK5ASXJnnmlcGkMICljmsikDIyMDTXNzTUNzBWMDCwAiMdHd/M4uTUnJzEvNT80mKFoNTk1MyCEuzG6OhYgAhfN3cdI3NLc2MDQ0MdY1MDIwMzM0McNiMBYx0jhLZBB1z9XHi5AFBLAQIUABQAAAAIAAuEaEue7VBfgQAAAGoBAAAcAAAAAAAAAAEAIAAAAAAAAABJbnZUcmFuc2FjdGlvbnNJbnRlcmZhY2UuY3N2UEsFBgAAAAABAAEASgAAALsAAAAAAA==</erp:Content>"
                        +"            <erp:FileName  xmlns:erp=\"http://xmlns.oracle.com/apps/financials/commonModules/shared/model/erpIntegrationService/\">abc3.zip</erp:FileName>"
                        +"  </typ:document>"
                        +"</typ:uploadFileToUcm>"
    }

    soap.createClient(url, soap_client_options , function(err, client) {
      if(err){
        console.log('Unable to connect to cloud. Maybe authentication header has some problems.');
        console.log(err);
        return;
      }
      client.addSoapHeader('Authorization', auth);

  	  client.uploadFileToUcm(args, function(err, result) {
          if(err){
            console.log(err);
            fs.writeFileSync('uploadFileToUcm.json',JSON.stringify(err));
            console.log('Error occured');
            fs.writeFileSync('uploadFileToUcm client last request.XML', client.lastRequest);
            return;
          }
          console.log(result);
          fs.writeFileSync('uploadFileToUcm.json',JSON.stringify(result));
          console.log('Successful soap request.');
      });

    });
}

//4
function downloadESSJobExecutionDetails(requestIdInput) {
    soap_param= soap_request();
    var url= soap_param[0];
    let request_with_defaults = soap_param[1];
    var auth = soap_param[2];

    let soap_client_options = {
      'request': request_with_defaults,
      overridePromiseSuffix: 'downloadESSJobExecutionDetails'
    };

    var args = {
      requestId : requestIdInput,//'1406303' //eneter request is and check by running the program
      fileType : 'zip'
    };

    soap.createClient(url, soap_client_options , function(err, client) {
      if(err){
        console.log('Unable to connect to cloud. Maybe authentication header has some problems.');
        console.log(err);
        return;
      }
      client.addHttpHeader('Authorization', auth);
  	  //client.setSecurity(new soap.BasicAuthSecurity('fin_impl', 'yLx95345'));

  	  client.downloadESSJobExecutionDetails(args, function(err, result) {
          if(err){
      			console.log('Error occured');
            console.log(err);
            return;
      		}

  		    console.log(result);
          fs.writeFileSync('downloadESSJobExecutionDetails.json',JSON.stringify(result));
          fs.writeFileSync('result.zip',result.result[0].Content.toString());
          fs.writeFileSync('resultJ.json',JSON.stringify(result.result[0].Content));
          console.log('Successful soap request.');
      });

    });
}

*/
