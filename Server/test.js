
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}
function httpPost(theUrl){
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open( "POST", theUrl, false ); // false for synchronous request
  xmlHttp.send("action=200&user=me&passPhrase=cheese");
  return xmlHttp.responseText;

}
console.log(httpPost("http://localhost:3000"));
