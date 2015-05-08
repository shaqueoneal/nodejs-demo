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
          hostname = stdout.split('\n')[1].split(' ')[0].trim();
          console.log("get " + ip + "'s host name:" + hostname);           
        }

        cb(hostname);
      });
  }  
}

exports.getHostNameByIp = getHostNameByIp;
