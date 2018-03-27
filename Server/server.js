const http = require('http');
const fs = require('fs');
const url = require('url');
const cryptico = require('cryptico');
const CryptoJS = require("crypto-js");

const Bits = 2048;
const PassPhrase = "Veteran of a thousand psychic wars";
const RSAKey = cryptico.generateRSAKey(PassPhrase, Bits);

const SendPubKey = 100;

const CreateUser = 200;
const CreateKey = 201;
const CreateGroup = 202;

const DeleteUser = 203;
const DeleteKey  = 204;
const DeleteGroup = 205;

const AddUserToGroup = 206;
const RemoveUserFromGroup = 207;

const Encrypt = 300;
const Decrypt = 301;

var Groups = {};

var keys = [];
function getUrlVars(url) {
    var hash;
    var myJson = {};
    var hashes = url.slice(url.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        myJson[hash[0]] = hash[1];
    }
    return myJson;
}
server = http.createServer( function(req, res) {

    //console.dir(req.param);

    if (req.method == 'POST') {
        console.log("POST");
        var body = '';
        req.on('data', function (data) {
            body += data;
        });
        req.on('end', function () {

			var newDict = getUrlVars(body);
			console.log(body);
			console.log(newDict['action'] + " ");
			var responseText = "Invalid request";

			if ("action" in newDict){
				if (newDict['action'] == SendPubKey){
					responseText =  cryptico.publicKeyString(RSAKey);
				}
				else if (newDict['action'] == CreateUser && "user" in newDict){

					var pass = newDict["passPhrase"];
					var newKey = cryptico.generateRSAKey(pass, Bits);

					keys.push({[newDict['user']] : newKey});
					responseText = cryptico.publicKeyString(newKey);

					var json = JSON.stringify(keys);
					var fs = require('fs');
					fs.writeFile('myjsonfile.json', json, 'utf8', function (err) {
						if (err) throw err;
						console.log('Saved!');
					});;
				}
				else if(newDict['action'] == CreateGroup && "user" in newDict && "pubKey" in newDict && "groupName" in newDict){

					users = {};
					users[newDict['user']] = {'role':'admin'};

					admin = users[newDict['user']];

					admin['pubKey'] = newDict['pubKey'];
					Groups[newDict['groupName']] = {};
					Groups[newDict['groupName']]['users'] = users;
					var key = cryptico.generateAESKey();
					Groups[newDict['groupName']]['key'] = key;
					responseText = "Created group";
				}
				else if (newDict['action'] == Encrypt && 'user' in newDict && 'group' in newDict && 'text' in newDict){

          var group = newDict['group'];
					if(group in Groups && newDict['user'] in Groups[group]['users']){
						var str = cryptico.decrypt(newDict['text'], RSAKey);
						var AESKey = Groups[group]['key'];
						var result = cryptico.encryptAESCBC(str, AESKey);
						responseText = result;
					}
					else {
						console.log(" group details");
						responseText = "invalid details";
					}
				}
				else if (newDict['action'] == Decrypt && 'user' in newDict && 'group' in newDict && 'text' in newDict){
					var group = newDict['group'];
					var user = newDict['user'];
					if(group in Groups && newDict['user'] in Groups[group]){

						var str = decodeURIComponent(newDict['text']);
						var AESKey = Groups[group]['key'];
						var pubKey = Groups[group][user]['key'];
						var result = cryptico.decryptAESCBC(str, AESKey);

						result = cryptico.encrypt(result, pubKey).cipher;
						responseText = result;
					}
					else {
						responseText = "invalid details";
					}
				}

			}
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.end(responseText);

		});

    }
    else
    {
        console.log("GET");
		var responseText = "Invalid Action";

		var body = '';
        var newDict = url.parse(req.url, true).query;
		console.log(newDict);
		//console.log(newDict['action'] + " ");
		if ("action" in newDict){
			if (newDict['action'] == SendPubKey){
				responseText =  cryptico.publicKeyString(RSAKey);
			}
			else if (newDict['action'] == CreateUser && "user" in newDict){

				var pass = newDict["passPhrase"];
				var newKey = cryptico.generateRSAKey(pass, Bits);

				keys.push({[newDict['user']] : newKey});
				responseText = cryptico.publicKeyString(newKey);

				var json = JSON.stringify(keys);
				var fs = require('fs');
				fs.writeFile('myjsonfile.json', json, 'utf8', function (err) {
					if (err) throw err;
					console.log('Saved!');
				});;
			}
			else if(newDict['action'] == CreateGroup && "user" in newDict && "pubKey" in newDict && "group" in newDict){

				users = {};
				users[newDict['user']] = {'role':'admin'};

				admin = users[newDict['user']];

				admin['key'] = newDict['pubKey'];
				Groups[newDict['group']] = {};
				Groups[newDict['group']]['users'] = users;
				var key = new Buffer(cryptico.generateAESKey());
        key = key.toString();
				Groups[newDict['group']]['key'] = key;
				responseText = "Created group";
			}
			else if (newDict['action'] == Encrypt && 'user' in newDict && 'group' in newDict && 'text' in newDict){
				var group = newDict['group'];
				if(group in Groups && newDict['user'] in Groups[group]['users']){
					var str = cryptico.decrypt(newDict['text'], RSAKey).plaintext;
					console.log("string is " + str);
					var key = Groups[group]['key'];
					var result = CryptoJS.AES.encrypt(str, key).toString();
          console.log(result);
          responseText = result;
				}
				else {
					console.log(" group details");
					responseText = "invalid details";
				}
			}
			else if (newDict['action'] == Decrypt && 'user' in newDict && 'group' in newDict && 'text' in newDict){
				var group = newDict['group'];
				var user = newDict['user'];
				if(group in Groups && newDict['user'] in Groups[group]['users']){
					console.log("Decrypt");
					var str = newDict['text'];
					console.log(str);
					var AESKey = Groups[group]['key'];

					var pubKey = Groups[group]['users'][user]['key'];
					var result = CryptoJS.AES.decrypt(str, AESKey).toString(CryptoJS.enc.Utf8);
					console.log(result);
					//result = cryptico.encrypt(result, pubKey).cipher;
					responseText = result;
					console.log("--------------");
				}
				else {
					responseText = "invalid details";
				}
			}

		}
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(responseText + " ");
    }

});

port = 3000;
host = '127.0.0.1';
server.listen(port, host);
console.log('Listening at http://' + host + ':' + port);
