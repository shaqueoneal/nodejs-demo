
var util = require('./util');     // 必须加./
var request = require('request');
var async = require('async');

//usage: node uistest http://172.15.15.254:7042 add 128 host

if (process.argv.length < 6) {
  console.log("usage: node uistest url {add|del} {num} {host|hostset} [to|from hostset {num}]");
  console.log("eg: node uistest http://172.15.15.254:7042 add 128 host");
  return; 
}

var g_url = process.argv[2];
// console.log(process.argv);

var op = {};
op.type = process.argv[3];
op.num = process.argv[4];
op.target = process.argv[5];
op.targetNum = process.argv[8];

var g_session;

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

  if (('add' == op.type) && ('host' == op.target)) {
    if (op.targetNum > 0 && op.targetNum <= 64) {
      addHostToHostSetTest(op.num, op.targetNum);
    }
    else {
      addHostTest(op.num);
    }
  }
  else if (('del' == op.type) && ('host' == op.target)) {
    if (op.targetNum > 0 && op.targetNum <= 64) {
      delHostFromHostSetTest(op.num, op.targetNum);
    }
    else {
      delHostTest(op.num);
    }
  }
  else if (('add' == op.type) && ('hostset' == op.target)) {
    addHostSetTest(op.num);    
  }
  else if (('del' == op.type) && ('hostset' == op.target)) {
    delHostSetTest(op.num);    
  }
  else {
    console.log("usage: node uistest url {add|del} {num} {host|hostset} [to|from hostset {num}]");
    console.log("eg: node uistest http://172.15.15.254:7042 add 128 host");
  }

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

var g_i = 0;

function addHostToHostSetTest(hostNum, hostSetNum) {
  g_i = 0;
  setInterval(function () {addHostToHost(hostNum, g_i); g_i++;}, 15000);
}

function addHostToHost(num, hostSetId) {
  var jsonObj = {
    "module": "host", 
    "method": "host_attach",
    "session_key": g_session,
    "hostsetid": hostSetId + ""    
  };

  for (var i = 0; i < num; i++) {
    jsonObj.id = i + "";

    console.log(jsonObj);
    util.sendJsonRequest(g_url, "POST", jsonObj, 60000, function (data) {
      console.log(data);
    });
  }
}

function delHostFromHostSetTest(hostNum, hostSetNum) {
  // for (var i = 0; i < hostSetNum; i++) {
  //   delHostFromHostSet(hostNum, i);
  // }
  g_i = 0;
  setInterval(function() {delHostFromHostSet(hostNum, g_i); g_i++}, 15000);
}

function delHostFromHostSet(num, hostSetId) {
  var jsonObj = {
    "module": "host", 
    "method": "host_detach",
    "session_key": g_session,
    "hostsetid": hostSetId + ""    
  };

  for (var i = 0; i < num; i++) {
    jsonObj.id = i + "";

    console.log(jsonObj);
    util.sendJsonRequest(g_url, "POST", jsonObj, 60000, function (data) {
      console.log(data);
    });
  }
}