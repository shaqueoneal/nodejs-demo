var childProcess = require('child_process');
var net = require('net');

function getHostNameByIp(ip, cb) {
  var hostname = "";

  if (!net.isIP(ip)) {
    console.log("Error: invalid ip");
    cb(hostname);
  }
  else {
    if (net.isIPv6(ip)) {
      ip = ip.slice(7); // to ipv4
    }

    childProcess.exec('nmblookup -A ' + ip, 
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
      });
  }  
}

exports.getHostNameByIp = getHostNameByIp;
