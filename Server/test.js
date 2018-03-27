const atob = require('atob').atob;
const cryptico = require('cryptico')

const serverKey = "kTGedl45NztbOvky2599Ur5h6vk4ZrmMbDd+5sg5peX342ESBsX/usHNBmGIbLt5gz+N9B66T+jnXU8MYYUwxYC4lw0kG6X4cqhzJfcZAY4e0A+b0hamUQg5FYPDIURWcN2oHKPq1ysbJDzrUQEuVIlsV44HSsvB1lKcmzS/7DuX6YvYQjMOx8Bp5PU1ih9an0NhDVNxDsTRxmrQ85aHLcpbM898VMtfi7rNcS6mXV4yn61+9q2khdWgpxS/U4uvhOeysY20hiV0ppA0YWJAucxQF2j50eB9Ak46iXUPoCOhDPAvsP2HPuB1k0oC9X20uJ/4y0Ls9MExLyoCT0UnWw==";

var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const Bits = 2048;
const PassPhrase = "Don't fear the reaper";
const RSAKey = cryptico.generateRSAKey(PassPhrase, Bits);



function httpGet(theUrl, data)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl+"?" + data, false ); // false for synchronous request
    xmlHttp.send();
    return xmlHttp.responseText;
}
function httpPost(theUrl, data){
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open( "POST", theUrl, false ); // false for synchronous request
  xmlHttp.send(data);
  return xmlHttp.responseText;

}

console.log(httpGet("http://localhost:3000", "action=100"));
var key = cryptico.publicKeyString(RSAKey);
console.log(httpGet("http://localhost:3000","action=202&user=test&pubKey=" +encodeURIComponent(key) + "&group=test"));

var text = cryptico.encrypt("wooho it works+++\\s", serverKey).cipher;
console.log(typeof(text));
var ciphertext = httpGet("http://localhost:3000","action=300&user=test&text=" + encodeURIComponent(text) + "&group=test");
console.log(ciphertext);
var plaintext = httpGet("http://localhost:3000", "action=301&user=test&text=" + encodeURIComponent(ciphertext) + "&group=test");
console.log(plaintext);
