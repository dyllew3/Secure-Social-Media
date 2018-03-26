const http = require('http');
const fs = require('fs');
const url = require('url');
const cryptico = require('cryptico');

const Bits = 2048;

const CreateUser = 200;
const CreateKey = 201;
const CreateGroup = 202;

const DeleteUser = 203;
const DeleteKey  = 204;
const DeleteGroup = 205;

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

    console.dir(req.param);

    if (req.method == 'POST') {
        console.log("POST");
        var body = '';
        req.on('data', function (data) {
            body += data;
            console.log("Partial body: " + body);
        });
        req.on('end', function () {
          var newDict = getUrlVars(body);
          console.log(newDict['action'] + " ");
          var responseText = "Invalid request";
          if ("action" in newDict){
            if (newDict['action'] == CreateUser && "user" in newDict){
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
          }
          res.writeHead(200, {'Content-Type': 'text/html'});
          res.end(responseText);
          console.log("Body: " + body);
        });

    }
    else
    {
        console.log("GET");
        var queryData = url.parse(req.url, true).query;
        console.log("Parameters: " + Object.keys(queryData));
        var responseText = "Invalid request";
        if ("action" in queryData){
          if (queryData['action'] == CreateUser && "user" in queryData){
            var pass = queryData["passPhrase"];
            var newKey = cryptico.generateRSAKey(pass, Bits);
            keys.push({[queryData['user']] : newKey});
            responseText = cryptico.publicKeyString(newKey);
            var json = JSON.stringify(keys);
            var fs = require('fs');
            fs.writeFile('myjsonfile.json', json, 'utf8', function (err) {
              if (err) throw err;
              console.log('Saved!');
            });;
          }
        }
        //var html = '<html><body><form method="post" action="http://localhost:3000">Name: <input type="text" name="name" /><input type="submit" value="Submit" /></form></body>';
        var html = "<html>Response</html>";
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(responseText + " ");
    }

});

port = 3000;
host = '127.0.0.1';
server.listen(port, host);
console.log('Listening at http://' + host + ':' + port);
