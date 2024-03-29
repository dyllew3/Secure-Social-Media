const http = require('http');
const fs = require('fs');
const url = require('url');
const cryptico = require('cryptico');
const CryptoJS = require("crypto-js");

const Bits = 2048;
const PassPhrase = "Veteran of a thousand psychic wars";
const RSAKey = cryptico.generateRSAKey(PassPhrase, Bits);

const SendPubKey = 100;

const CreateGroup = 202;

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
    }
    else
    {
        console.log("GET");
		var responseText = "Invalid Action";

		var newDict = url.parse(req.url, true).query;
    console.log(JSON.stringify(newDict));
		if ("action" in newDict){
			console.log(newDict['action']);
			if (newDict['action'] == SendPubKey){
				responseText =  cryptico.publicKeyString(RSAKey);
			}
			else if(newDict['action'] == CreateGroup && "user" in newDict && "pubKey" in newDict && "group" in newDict){
        if (newDict['group'] in Groups) {
          responseText = newDict + " already exists";
        }
        else {
          users = {};
  				users[newDict['user']] = {'role':'admin'};

  				admin = users[newDict['user']];

  				admin['key'] = newDict['pubKey'];
  				Groups[newDict['group']] = {};
  				Groups[newDict['group']]['users'] = users;
  				var key = new Buffer(cryptico.generateAESKey());
  				key = key.toString();
  				Groups[newDict['group']]['key'] = key;
          console.log("Groups: " + JSON.stringify(Groups));
  				responseText = "Created group " + newDict['group'];
        }

			}
			else if(newDict['action'] == AddUserToGroup){
					if('admin' in newDict && 'group' in newDict  && 'user' in newDict && 'key' in newDict ){
						var user = newDict['user'];
						var admin = newDict['admin'];
						var group = newDict['group'];
						var key = newDict['key'];
						if(group in Groups && admin in Groups[group]['users'] && Groups[group]['users'][admin]['role'] == 'admin'){
							var users = Groups[group]['users'];
							users[user] = {'role':'user','key':key};
              console.log("users: " + JSON.stringify(users));
							responseText= user + " added to " + group;
						}
						else{
							responseText = "Not admin";
						}
					}
					else{
						responseText = "Invalid parameters";
					}
			}
			else if(newDict['action'] == RemoveUserFromGroup){
					if('admin' in newDict && 'group' in newDict  && 'user' in newDict){
						var user = newDict['user'];
						var admin = newDict['admin'];
						var group = newDict['group'];

						if(group in Groups && admin in Groups[group]['users'] && Groups[group]['users'][admin]['role'] == 'admin'){
							var users = Groups[group]['users'];
							delete users[user];
              console.log("users: " + JSON.stringify(users));
							responseText= user + " removed from " + group;
						}
						else{
							responseText = "Not admin";
						}
					}
					else{
						responseText = "Invalid parameters";
					}
			}
			else if(newDict['action'] == DeleteGroup){
				if('group' in newDict && 'admin' in newDict){
					var group = newDict['group'];
					var admin = newDict['admin'];
					if(group in Groups){
						if( admin in Groups[group]['users'] && Groups[group]['users'][admin]['role'] == 'admin'){

							delete Groups[group];
              console.log("Groups: " + JSON.stringify(Groups));

							responseText = group + " has been deleted";
						}
						else{
							responseText = "Not a valid admin";
						}
					}
					else{
						responseText = "Not valid group";
					}
				}
				else {
					responseText = "Not enough parameters for request";
				}
			}
			else if (newDict['action'] == Encrypt && 'user' in newDict && 'group' in newDict && 'text' in newDict){
				var group = newDict['group'];
				if(group in Groups && newDict['user'] in Groups[group]['users']){
					var str = cryptico.decrypt(newDict['text'], RSAKey).plaintext;
					var key = Groups[group]['key'];
					var result = CryptoJS.AES.encrypt(str, key).toString();
					console.log("Encrypted text: " + result);
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
					result = cryptico.encrypt(result, pubKey).cipher;
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
