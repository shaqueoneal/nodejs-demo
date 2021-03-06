/* to use devFinder you need to expand arp table length:
   	echo 8192 > /proc/sys/net/ipv4/neigh/default/gc_thresh3 
 */

var request = require('request');
var snmp = require ("net-snmp");
var childProcess = require('child_process');
var fs = require('fs');
var path = require('path');
var async = require('async');

var g_aoNetHost = [];

/* find devices in net */
var g_netAllDevs = [
	{
		netName: "192.168.1.0",
		netDevStats: [],	//x.x.x.1~x.x.x.254
		netDevTypes: [],
		bSearching: false,
	},
	{
		netName: "192.168.3.0",
		netDevStats: [],	//x.x.x.1~x.x.x.254
		netDevTypes: [],
		bSearching: false,
	},	
	{
		netName: "192.168.4.0",
		netDevStats: [],	//x.x.x.1~x.x.x.254
		netDevTypes: [],
		bSearching: false,
	},
	{
		netName: "192.168.5.0",
		netDevStats: [],	//x.x.x.1~x.x.x.254
		netDevTypes: [],
		bSearching: false,
	},
	{
		netName: "192.168.8.0",
		netDevStats: [],	//x.x.x.1~x.x.x.254
		netDevTypes: [],
		bSearching: false,
	},
];

function initNetHost(netIp) {	
	for (var i = 1; i < 255; i++) {
		var host = {};	
		host.id = (netIp.slice(-3, -2) -1) * 254  + i; 
		host.ip = netIp.substring(0, netIp.length-1) + i;
		host.link = false;
		host.type = "Unknown";

		g_aoNetHost.push(host);
	}
}

var g_netIndex = 0;

function parseDevTypeByHttp(string) {
	var devType;

	if (!string) {
		return;
	}

    if (string.indexOf("iLO") >= 0 ) {
        console.log("iLO");
        devType = "iLO";
    }
    else if (string.indexOf("at OA") >= 0 ) {
        console.log("OA");
        devType = "OA";
    }
    else if (string.indexOf("CVM") >= 0 ) {
        console.log("CAS-CVM");
        devType = "CAS-CVM";
    }
    else if (string.indexOf("CVK") >= 0 ) {
        console.log("CAS-CVK");
        devType = "CAS-CVK";
    }    

    return devType;
}


function getDevTypeInNet(netIp) {
	var netDev;
	for (var j = 0; j < g_netAllDevs.length; j++) {
		if (g_netAllDevs[j].netName == netIp) {
			netDev = g_netAllDevs[j];
			break;
		}
	}

	console.log("parsing dev in net: " + netIp);	

	// x.x.x.1~x.x.x.254
	for (var i = 1; i < 255; i++) {
		(function(i) {
			if (1 == netDev.netDevStats[i - 1]) {
				getDevType(netIp.substring(0, netIp.length-1) + i, function (devType) {
					if (devType) {
						console.log("devType[" + (netIp.substring(0, netIp.length-1) + i) + "] = " + devType);
						netDev.netDevTypes[i - 1] = devType;				
					}
					else {
						if (!netDev.netDevTypes[i - 1]) {
							// console.log("devType[" + (netIp.substring(0, netIp.length-1) + i) + "] = " + "Unknown");
							netDev.netDevTypes[i - 1] = "Unknown";
						}
					}
				});
			}
		})(i);
	}
}

//Find all dev in netIp of format "192.168.x.0"
function findDevInNet(netIp) {
	var netDev;
	for (var j = 0; j < g_netAllDevs.length; j++) {
		if (g_netAllDevs[j].netName == netIp) {
			netDev = g_netAllDevs[j];
		}
	}

	if (!netDev) {
		netDev = {
			netName: netIp,
			netDevStats: [],	//x.x.x.1~x.x.x.254
			netDevTypes: [],
			bSearching: false,
		};
	}

	if (netDev.bSearching) {
		console.log('searching:' + netIp);
		return;
	}

	netDev.bSearching = true;
	console.log("searching net: " + netIp);	

	// x.x.x.1~x.x.x.254
	for (var i = 1; i < 255; i++) {
		(function(i){
			childProcess.exec('ping -w 1 ' +　(netIp.substring(0, netIp.length-1) + i), {timeout: 2000},
			// childProcess.spawnSync('ping -w 1 ' +　(netIp.substring(0, netIp.length-1) + i), {timeout: 2000},
			function (error, stdout, stderr) {
				if (error) {
					netDev.netDevStats[i - 1] = -1; 
				}
				else {
					// console.log(i);
					netDev.netDevStats[i - 1] = 1;
					// console.log('Child Process STDOUT: '+ stdout);
				}			
			});
		})(i);
	}
}

function isNetPolled(netIp) {
	for (var i = 0; i < g_netAllDevs.length; i++) {
		if (g_netAllDevs[i].netName == netIp) {
			for (var j = 0; j < 254; j++) {
				if (undefined == g_netAllDevs[i].netDevStats[j]) {
					console.log("net: " + netIp + " not polled");
					break;
				}		
			}

			if (j == 254) {
				g_netAllDevs[i].bSearching = false;
				
				return true;
			}
		}
	}

	return false;
}

// save dev list to file.json
function saveDevList() {
	var devList = [];

	for (var i = 0; i < g_netAllDevs.length; i++) {
		var netIp = g_netAllDevs[i].netName;

		for (var j = 0; j < 254; j++) {
			var dev = {
				id : i * 254 + j, 
				ip : (netIp.substring(0, netIp.length-1) + (j + 1)),
				type: g_netAllDevs[i].netDevTypes[j] + "",
				status: g_netAllDevs[i].netDevStats[j],
			}

			if (("undefined" != dev.type) && ("Unknown" != dev.type)) {
				devList.push(dev);	
			}				

			console.log(dev)
		}
	}

	var json = {data : devList};

	fs.writeFile(path.join(__dirname, 'public/ajax/devList.json'), JSON.stringify(json), function (err) {
        if (err) {
        	console.log(err);
        }

		// for (var i = 0; i < g_netAllDevs.length; i++) {
		// 	g_netAllDevs[i].netDevStats = [];
		// }
		
		// g_netIndex = 0;	
		// g_bAllPolled = false;


        console.log("Export dev list success!");
    });

}

var g_bAllPolled = false;

//netIp is in format of "192.168.1.0"
// function initDevFind() {
// 	setInterval(function(){
// 		if (g_bAllPolled) {
// 			return;
// 		}

// 		if (isNetPolled(g_netAllDevs[g_netIndex].netName)) {
// 			// childProcess.exec('ip link set arp off eth0; ip link set arp on dev eth0');

// 			getDevTypeInNet(g_netAllDevs[g_netIndex].netName);

// 			if (g_netAllDevs[g_netIndex + 1]) {
// 				g_netIndex += 1;
// 			}
// 			else {
// 				g_netIndex = 0;
// 				g_bAllPolled = true;
// 				// a round over, save data

// 				setTimeout(function(){
// 					saveDevList();				
// 				}, 10000);
// 			}
// 		}
// 		else {			
// 			findDevInNet(g_netAllDevs[g_netIndex].netName);
// 		}
		
// 	}, 5000);	//5 seconds check if one net is polled
// }

var AsyncSquaringLibrary = {
  squareExponent: 2,
  square: function(number, callback){
    var result = Math.pow(number, this.squareExponent);
    setTimeout(function(){
      callback(null, result);
    }, 200);
  }
};


var DevType = {	
	getDevType : function getDevType(host, cb) {
		ip = host.ip;
	var url = "http://" + ip;
	var devType;

	var options = {
		url: url,
		rejectUnauthorized: false,
		timeout: 2000,    
		followRedirect: false,
	};

	request(options, function (error, response, body) {
		if (error) {
			// console.error (error);
			// cb(devType);
			return;
		}

		if (response.headers) {	// iLO
			var serverName = response.headers.server;
			devType = parseDevTypeByHttp(serverName);
		}

		// if (response.statusCode == 200) {   
		//   devType = parseDevTypeByHttp(body);
		// }

		if (response.statusCode == 302) {   // OA
			devType = parseDevTypeByHttp(body);
		}

		host.type = devType;
		// cb(devType);
		return;
	});


	// switch
	var session = snmp.createSession(ip, "public", {timeout: 1000});

	var oids = ["1.3.6.1.2.1.47.1.1.1.1.13.2"];

	session.get(oids, function (error, varbinds) {
	    if (error) {
	        console.error (error);	//{ [RequestTimedOutError: Request timed out] name: 'RequestTimedOutError', message: 'Request timed out' }
	    } 
	    else {
	        for (var i = 0; i < varbinds.length; i++) {
	            if (snmp.isVarbindError(varbinds[i])) {
	                console.error(snmp.varbindError (varbinds[i]));
	            }
	            else {
	                console.log (varbinds[i].oid + " = " + varbinds[i].value);
	                devType = varbinds[i].value + "";
	                break;
	            }
	        }
	    }

    	// cb(devType);
    	host.type = devType;
    	return;
	});

	session.on ("error", function (error) {
	    console.log (error.toString ());
	    session.close ();
	});

	// session.trap (snmp.TrapType.LinkDown, function (error) {
	// 	if (error) {
	// 		console.error (error);		    	
	// 	}

	// 	cb(devType);
 	// 	return;
	// });

	var options1 = {
		url: url + ":8080",
		rejectUnauthorized: false,
		timeout: 2000,    
		followRedirect: false,
	};

	// CAS
	request(options1, function (error, response, body) {
		if (error) {
			console.error (error);
			// cb(devType);
			return;
		}

		if (response.headers) {	
			var serverName = response.headers.server;
			devType = parseDevTypeByHttp(serverName);
		}

		// cb(devType);
		host.type = devType;
    	return;
	});

}

};

function testIpAccess(host, cb) {
	var ip = host.ip;
	childProcess.exec('ping -w 2 ' +　host.ip, 
		function (error, stdout, stderr) {
			if (error) {
				console.log(error);
				host.link = false; 
			}
			else {
				host.link = true;
			}

			cb(null, host);			
		});
}

function testServer(host, cb) {
	var	ip = host.ip;
	var url = "http://" + ip;
	var devType;

	var options = {
		url: url,
		rejectUnauthorized: false,
		timeout: 2000,    
		followRedirect: false,
	};

	if (!host.link) {
		cb(null, host);
		return;
	}

	request(options, function (error, response, body) {
		if (error) {
			// console.error (error);
		}
		else {
			if (response.headers) {	// iLO
				var serverName = response.headers.server;
				devType = parseDevTypeByHttp(serverName);
			}

			if (response.statusCode == 302) {   // OA
				devType = parseDevTypeByHttp(body);
			}

			host.type = devType;			
		}

		cb(null, host);
	});
}


function testSwitch(host, cb) {
	var ip = host.ip;
	var session = snmp.createSession(ip, "public", {timeout: 1000});
	var oids = ["1.3.6.1.2.1.47.1.1.1.1.13.2"];
	var devType;

	if (!host.link) {
		cb(null, host);
		return;
	}

	session.get(oids, function (error, varbinds) {
		if (error) {
			//console.error (error);	{ [RequestTimedOutError: Request timed out] name: 'RequestTimedOutError', message: 'Request timed out' }
		} 
		else {
			for (var i = 0; i < varbinds.length; i++) {
				if (snmp.isVarbindError(varbinds[i])) {
					console.error(snmp.varbindError (varbinds[i]));
				}
				else {
					console.log (varbinds[i].oid + " = " + varbinds[i].value);
					devType = varbinds[i].value + "";
					host.type = devType;
					break;
				}
			}
		}

		cb(null, host);
	});

	session.on ("error", function (error) {
		console.log (error.toString ());
		session.close ();
	});
}

function testCas(host, cb) {
	var	ip = host.ip;
	var url = "http://" + ip;
	var devType;

	var options1 = {
		url: url + ":8080",
		rejectUnauthorized: false,
		timeout: 2000,    
		followRedirect: false,
	};

	if (!host.link) {
		console.log(host);
		cb(null, host);
		return;
	}

	// CAS
	request(options1, function (error, response, body) {
		if (error) {
			console.error (error);
		}
		else {	
			if (response.headers) {	
				var serverName = response.headers.server;
				devType = parseDevTypeByHttp(serverName);
				host.type = devType;
			}
		}

		console.log(host);
		cb(null, host);
	});
}

function initDevFind() {
	var file = path.join(__dirname, 'public/ajax/devList.json');

	fs.readFile(file, function (err, json) {		
		if (err) {
			initNetHost("192.168.1.0");
			initNetHost("192.168.2.0");
			initNetHost("192.168.3.0");
			initNetHost("192.168.4.0");
			initNetHost("192.168.5.0");
			initNetHost("192.168.6.0");
			initNetHost("192.168.7.0");
			initNetHost("192.168.8.0");
			initNetHost("192.168.9.0");	
		}
		else {
			g_aoNetHost = JSON.parse(json).data;
		}		

		initDevFindParser();
	});
}

var testDevType = async.compose(testCas, testSwitch, testServer, testIpAccess);


function initDevFindParser(argument) {
	// var q = async.queue(function(task, callback) {
	//     log('worker is processing task: ', task.name);
	//     task.run(callback);
	// }, 200);

	// for (var i = 0; i < g_aoNetHost.length; i++) {
	// 	q.push({name:'t1', run: function(cb){
	// 		log('t1 is running, waiting tasks: ', q.length());
	// 		t.fire('t1', cb, 400);
	// 	}}, function(err) {
	// 		log('t1 executed');
	// 	});
	// }

	// async.eachLimit(g_aoNetHost, 100, function(item, callback) {
// fgh(4,function(err,result){
//     console.log('1.1 err: ', err);
//     console.log('1.1 result: ', result);

// });
// console.log(item);
	// 	testDevType(item);

	// });


	var cargo = async.cargo(function (tasks, callback) {
	    // for(var i = 0; i < tasks.length; i++){
	    //   console.log('hello ' + tasks[i].ip);

	    //   if (i % 253 == 0) {
	    //   	childProcess.exec('ip link set arp off eth0; ip link set arp on dev eth0' , function (error, stdout, stderr) {
	    //   		console.log("clear arp");
	    //   	});
	    //   }
	    // }
	    callback();
	}, 100);

	// cargo.saturated = function() {
	//     childProcess.exec('ip link set arp off eth0; ip link set arp on dev eth0' , function (error, stdout, stderr) {
	//       		console.log("clear arp");
	//       	});
	// }

	var g_netid = 0;

	var i = 0;

	cargo.empty = function() {
	    //clear arp cache
	    // childProcess.exec('ip link set arp off eth0; ip link set arp on dev eth0' , function (error, stdout, stderr) {
	    // childProcess.exec("arp -n|awk '/^[1-9]/{print \" arp -d \" $1}'|sh -x" , function (error, stdout, stderr) {
	    //   	console.log("clear arp");

	      	g_netid++;

	      	// var hosts = g_aoNetHost.slice(g_netid * 254, (g_netid + 1) * 254);

	      	if (g_netid >= 9) {
	      		return;
	      	}

	      	for (i = g_netid * 254; i < (g_netid + 1) * 254; i++) {
	      		(function(i){
	      			cargo.push(g_aoNetHost[i], function (err) {
		      			console.log(g_aoNetHost[i]);
		      			testDevType(g_aoNetHost[i]);
		      		});	
	      		})(i);
	      	}

	      	// hosts.forEach(function (host) {
	      	// 	cargo.push(host, function (err) {
	      	// 		console.log(host);
	      	// 		testDevType(host);
	      	// 	});
	      	// });
	    // });
	}

	cargo.drain = function() {
		if (g_netid >= 8) {
			setTimeout(function () {
				var json = {data : g_aoNetHost};

				fs.writeFile(path.join(__dirname, 'public/ajax/devList.json'), JSON.stringify(json, null, '\t'), function (err) {
					if (err) {
						console.log(err);
					}
					console.log("Export dev list success!");
				});
			}, 1000 * 10);
		}
	}

	// g_aoNetHost.slice(0, 254).forEach(function (host) {
	// 	cargo.push(host, function (err) {
	// 		console.log(host);
	// 		testDevType(host);
	// 	});
	// });

	for (var i = g_netid * 254; i < (g_netid + 1) * 254; i++) {
		(function(i){
			cargo.push(g_aoNetHost[i], function (err) {
				console.log(g_aoNetHost[i]);
				testDevType(g_aoNetHost[i]);
			});	
		})(i);
	}

	// for (var i = 0; i < g_aoNetHost.length; i++) {
	// 	var host = g_aoNetHost[i];

	// 	cargo.push(host, function (err) {
	// 		console.log(host);
	// 		testDevType(host);
	// 	});
	// };
}

initDevFind();

setInterval(function(){      
	initDevFind();
}, 1000 * 60 * 10);

exports.initDevFind = initDevFind;
