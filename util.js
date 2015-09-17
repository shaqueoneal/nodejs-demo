var childProcess = require('child_process');
var net = require('net');
var request = require('request');

/* 要求samba打开 */
function getHostNameByIp(ip, cb) {
  var hostname = ip;

  if (!net.isIP(ip)) {
    console.log("Error: invalid ip");
    cb(hostname);
  }
  else {
    if (net.isIPv6(ip)) {
      ip = ip.slice(7); // to ipv4
    }

    childProcess.exec('nmblookup -A ' + ip, {timeout: 1000},
      function (error, stdout, stderr) {
        if (error) {
          console.log("cannot get " + ip + "'s host name"); 
        }
        else {
          var lines = stdout.split('\n');
          for (var i = 0; i < lines.length; i++) {
            if (lines[i].indexOf('<GROUP>') >= 0) {
              continue;
            }

            if (lines[i].indexOf('<00>') >= 0) {
              hostname = lines[i].split(' ')[0].trim();
              console.log("get " + ip + "'s host name:" + hostname); 
              break;
            }
          }                    
        }
      
        cb(hostname);
      }
    );
  }  
}

function sendJsonRequest(url, method, jsonData, timeout, cb) {
  var options = {
    headers: {"Connection": "close"},
    url: url + "/uism/",
    method: method,
    json: true,
    timeout: timeout, 
    body: jsonData
  };

  request(options, function (error, response, body) {
    if (cb) {
      cb(body);
    };
  });
}

function addZero(str,length){        
  return new Array(length - str.length + 1).join("0") + str;
}

exports.addZero = addZero;
exports.getHostNameByIp = getHostNameByIp;
exports.sendJsonRequest = sendJsonRequest;
