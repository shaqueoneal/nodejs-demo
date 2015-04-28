
var request = require('request');
var childProcess = require('child_process');
var fs = require('fs');
var path = require('path');

/* find devices in net */
var netAllDevs = [
	{
		netName: "192.168.1.0",
		netDevs: [],	//x.x.x.1~x.x.x.254
		bSearching: false,
	},
	{
		netName: "192.168.2.0",
		netDevs: [],	//x.x.x.1~x.x.x.254
		bSearching: false,
	},
	{
		netName: "192.168.3.0",
		netDevs: [],	//x.x.x.1~x.x.x.254
		bSearching: false,
	},	
	{
		netName: "192.168.4.0",
		netDevs: [],	//x.x.x.1~x.x.x.254
		bSearching: false,
	},
];

var g_netIndex = 0;

function getDevType(ip) {
	var options = {
		headers: {"Connection": "close"},
	    // url: 'http://127.0.0.1:3005/Config',
	    url: 'http://' + ip + '/uism',
	    method: 'POST',
	    json:true,
	    body: {data:{channel : "aaa",appkey : "bbb"},sign : "ccc",token : "ddd"}
	};

	function callback(error, response, data) {
	    if (!error && response.statusCode == 200) {
	        console.log('----info------',data);

	        for (var i = 0; i < netAllDevs.length; i++) {
	        	if (ip.indexOf(netAllDevs[i].netName.substring(0, netAllDevs[i].netName.length - 2)) >= 0) {
	        		netAllDevs[i].netDev[ip.split('.')[3] - 1] = data.type;
	        	}
	        }
	    }
	}

	request(options, callback);
}

//Find all dev in netIp of format "192.168.x.0"
function findDevInNet(netIp) {
	var netDev;
	for (var j = 0; j < netAllDevs.length; j++) {
		if (netAllDevs[j].netName == netIp) {
			netDev = netAllDevs[j];
		}
	}

	if (!netDev) {
		netDev = {
			netName: netIp,
			netDevs: [],	//x.x.x.1~x.x.x.254
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
					netDev.netDevs[i - 1] = -1; 
				}
				else {
					console.log(i);
					netDev.netDevs[i - 1] = 1;
					console.log('Child Process STDOUT: '+ stdout);

					getDevType((netIp.substring(0, netIp.length-1) + i));
				}			
			});
		})(i);
	}	
}

function isNetPolled(netIp) {
	for (var i = 0; i < netAllDevs.length; i++) {
		if (netAllDevs[i].netName == netIp) {
			for (var j = 0; j < 254; j++) {
				if (undefined == netAllDevs[i].netDevs[j]) {
					console.log("net: " + netIp + " not polled");
					break;
				}		
			}

			if (j == 254) {
				netAllDevs[i].bSearching = false;
				
				return true;
			}
		}
	}

	return false;
}

function getDevInNet(netIp) {
	console.log(netDevs);
	return netDevs;
}

function saveDevList() {
	var devList = [];	

	for (var i = 0; i < netAllDevs.length; i++) {
		for (var j = 0; j < 254; j++) {
			var netIp = netAllDevs[i].netName;
			var dev = {
				ip : (netIp.substring(0, netIp.length-1) + (j + 1)),
				type: netAllDevs[i].netDevs[j],
				status: netAllDevs[i].netDevs[j],
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
		if (isNetPolled(netAllDevs[g_netIndex].netName)) {
			if (netAllDevs[g_netIndex + 1]) {
				g_netIndex += 1;
			}
			else {
				g_netIndex = 0;
				// a round over, save data
				
			}
		}
		else {			
			findDevInNet(netAllDevs[g_netIndex].netName);
		}
		
	}, 5000);	//5 seconds check if one net is polled

	setInterval(function(){
		saveDevList();

		for (var i = 0; i < netAllDevs.length; i++) {
			netAllDevs[i].netDevs = [];
		}
		
		g_netIndex = 0;	
	}, 1000 * 60 * 1); //10 minutes refresh
}

exports.initDevFind = initDevFind;
exports.getDevInNet = getDevInNet;
