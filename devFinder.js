
var request = require('request');
var snmp = require ("net-snmp");
var childProcess = require('child_process');
var fs = require('fs');
var path = require('path');

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
		netName: "192.168.8.0",
		netDevStats: [],	//x.x.x.1~x.x.x.254
		netDevTypes: [],
		bSearching: false,
	},
];

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

function getDevType(ip, cb) {
	var url = "http://" + ip;
	var devType;

	request(url, function (error, response, body) {
		if (error) {
			cb(devType);
			return;
		}

		if (response.headers) {	// iLO
			var serverName = response.headers.server;
			devType = parseDevTypeByHttp(serverName);
		}

		// if (!error && response.statusCode == 200) {   
		//   devType = parseDevTypeByHttp(body);
		// }

		if (!error && response.statusCode == 302) {   // OA
			devType = parseDevTypeByHttp(body);
		}

		cb(devType);
		return;
	});


	// switch
	var session = snmp.createSession (url, "public", {timeout: 1000});

	var oids = ["1.3.6.1.2.1.47.1.1.1.1.13.2"];

	session.get (oids, function (error, varbinds) {
	    if (error) {
	        // console.error (error);	//{ [RequestTimedOutError: Request timed out] name: 'RequestTimedOutError', message: 'Request timed out' }
	    } 
	    else {
	        for (var i = 0; i < varbinds.length; i++) {
	            if (snmp.isVarbindError(varbinds[i])) {
	                // console.error(snmp.varbindError (varbinds[i]));
	            }
	            else {
	                // console.log (varbinds[i].oid + " = " + varbinds[i].value);
	                devType = varbinds[i].value;

	            }
	        }
	    }


    	cb(devType);
    	return;
	});
	

	// CAS
	url += ":8080";
	request(url, function (error, response, body) {
		if (error) {
			cb(devType);
			return;
		}

		if (response.headers) {	
			var serverName = response.headers.server;
			devType = parseDevTypeByHttp(serverName);
			if (devType) {
				cb(devType);
				return;
			}
		}

		cb(devType);
    	return;
	});

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
						netDev.netDevTypes[i - 1] = devType;				
					}
					else {
						netDev.netDevTypes[i - 1] = "Unknown";
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
			childProcess.exec('ping -w 1 ' +　(netIp.substring(0, netIp.length-1) + i), 
			function (error, stdout, stderr) {
				if (error) {
					netDev.netDevStats[i - 1] = -1; 
				}
				else {
					console.log(i);
					netDev.netDevStats[i - 1] = 1;
					console.log('Child Process STDOUT: '+ stdout);
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
		for (var j = 0; j < 254; j++) {
			var netIp = g_netAllDevs[i].netName;
			var dev = {
				ip : (netIp.substring(0, netIp.length-1) + (j + 1)),
				type: g_netAllDevs[i].netDevTypes[j],
				status: g_netAllDevs[i].netDevStats[j],
			}

			if (1 === dev.status) {
				devList.push(dev);	
			}				
		}
	}

	var json = {data : devList};

	fs.writeFile(path.join(__dirname, 'public/ajax/devList.json'), JSON.stringify(json), function (err) {
        if (err) {
        	console.log(err);
        }

        console.log("Export dev list success!");
    });

}

//netIp is in format of "192.168.1.0"
function initDevFind() {
	setInterval(function(){
		if (isNetPolled(g_netAllDevs[g_netIndex].netName)) {
			if (g_netAllDevs[g_netIndex + 1]) {

				getDevTypeInNet(g_netAllDevs[g_netIndex].netName);

				g_netIndex += 1;
			}
			else {
				g_netIndex = 0;

				// a round over, save data
			}
		}
		else {			
			findDevInNet(g_netAllDevs[g_netIndex].netName);
		}
		
	}, 5000);	//5 seconds check if one net is polled

	setInterval(function(){
		saveDevList();

		for (var i = 0; i < g_netAllDevs.length; i++) {
			g_netAllDevs[i].netDevStats = [];
		}
		
		g_netIndex = 0;	
	}, 1000 * 60 * 1); //10 minutes refresh
}

initDevFind();

exports.initDevFind = initDevFind;
