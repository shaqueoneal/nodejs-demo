
var request = require('request');

var arguments = process.argv.splice(2);

var options = {
    url: arguments[0],
    rejectUnauthorized: false,
    timeout: 2000,    
    followRedirect: false,
};

function getDevTypeByHttp(string)
{
    if (string.indexOf("iLO") >= 0 ) {
        console.log("iLO");
    }
    else if (string.indexOf("at OA") >= 0 ) {
        console.log("OA");
    }
    else if (string.indexOf("CVM") >= 0 ) {
        console.log("CAS-CVM");
    }
    else if (string.indexOf("CVK") >= 0 ) {
        console.log("CAS-CVK");
    }    
}

request(options, function (error, response, body) {
  if (error) {
    return;
  }

  if (response.headers) {
    var serverName = response.headers.server;
    getDevTypeByHttp(serverName);
  }

  if (!error && response.statusCode == 200) {   // iLO
    getDevTypeByHttp(body);
  }

  if (!error && response.statusCode == 302) {   // OA
    getDevTypeByHttp(body);
  }
});