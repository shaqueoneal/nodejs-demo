
var snmp = require ("net-snmp");

var arguments = process.argv.splice(2);

var session = snmp.createSession (arguments[0], "public", {timeout: 1000});

var oids = ["1.3.6.1.2.1.47.1.1.1.1.13.2"];

session.get (oids, function (error, varbinds) {
    if (error) {
        console.error (error);	//{ [RequestTimedOutError: Request timed out] name: 'RequestTimedOutError', message: 'Request timed out' }
    } else {
        for (var i = 0; i < varbinds.length; i++) {
            if (snmp.isVarbindError(varbinds[i])) {
                console.error(snmp.varbindError (varbinds[i]));
            }
            else {
                console.log (varbinds[i].oid + " = " + varbinds[i].value);
            }
        }
    }
});

session.trap (snmp.TrapType.LinkDown, function (error) {
    if (error)
        console.error (error);
});