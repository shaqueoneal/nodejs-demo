
var util = require('./util');     // 必须加./
var request = require('request');

//node uistest 172.15.15.254
var g_url = process.argv.splice(2);
var g_session;

// console.log(arguments);

var jsonObj = {
  "module": "userm",
  "method": "login",
  "username": "sysadmin",
  "password": "uis2014"
};

util.sendJsonRequest(g_url, "POST", jsonObj, 60000, function (data) {
  if (undefined == data.session_key) {
    console.log("log in failed");
    return;
  }

  g_session = data.session_key;

  // addHostTest(256)
  // delHostTest(256)
  // addHostSetTest(64)
  delHostSetTest(64)
});

function addHostTest (num) {
  var jsonObj = {
    "module": "host", 
    "method": "host_add",
    "session_key": g_session,
    "ip": "",
    // "wwn": oHost.wwn + "",
    "iqn": "",
    // "name": oHost.name + "",
    "username": "",
    "password": "",
  };

  for (var i = 0; i < num; i++) {
    jsonObj.name = "testHost_" + i;
    jsonObj.wwn = util.addZero(i + "", 16);

    util.sendJsonRequest(g_url, "POST", jsonObj, 60000, function (data) {
      // console.log(data);
    });
  }
}

function delHostTest (num) {
  var jsonObj = {
    "module": "host", 
    "method": "host_del",
    "session_key": g_session,
  };

  for (var i = 0; i < num; i++) {
    jsonObj.ids = [i + ""];

    console.log(jsonObj);

    util.sendJsonRequest(g_url, "POST", jsonObj, 60000, function (data) {
      console.log(data);
    });
  }
}

function addHostSetTest (num) {
  var jsonObj = {
    "module": "host", 
    "method": "hostset_add",
    "session_key": g_session
  };

  for (var i = 0; i < num; i++) {
    jsonObj.name = "testHostSet_" + i;

    util.sendJsonRequest(g_url, "POST", jsonObj, 60000, function (data) {
      console.log(data);
    });
  }
}

function delHostSetTest (num) {
  var jsonObj = {
    "module": "host", 
    "method": "hostset_del",
    "session_key": g_session,
  };

  for (var i = 0; i < num; i++) {
    jsonObj.ids = [i + ""];

    console.log(jsonObj);
    util.sendJsonRequest(g_url, "POST", jsonObj, 60000, function (data) {
      console.log(data);
    });
  }
}

// var options = {
//     url: arguments[0],
//     rejectUnauthorized: false,
//     timeout: 2000,    
//     followRedirect: false,
// };

// function getDevTypeByHttp(string)
// {
//     if (string.indexOf("iLO") >= 0 ) {
//         console.log("iLO");
//     }
//     else if (string.indexOf("at OA") >= 0 ) {
//         console.log("OA");
//     }
//     else if (string.indexOf("CVM") >= 0 ) {
//         console.log("CAS-CVM");
//     }
//     else if (string.indexOf("CVK") >= 0 ) {
//         console.log("CAS-CVK");
//     }
//     else {
//         console.log(string);
//     }   
// }

// request(options, function (error, response, body) {
//   if (error) {
//     console.log(error);
//     return;
//   }

//   if (response.headers) {
//     var serverName = response.headers.server;
//     getDevTypeByHttp(serverName);
//   }

//   if (!error && response.statusCode == 200) {   // iLO
//     getDevTypeByHttp(body);
//   }

//   if (!error && response.statusCode == 302) {   // OA
//     getDevTypeByHttp(body);
//   }
// });