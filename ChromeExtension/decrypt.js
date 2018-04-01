var cryptico = require('cryptico');
function RSAParse(rsaString) {
    var json = JSON.parse(rsaString);
    var rsa = new cryptico.RSAKey();

    rsa.setPrivateEx(json.n, json.e, json.d, json.p, json.q, json.dmp1, json.dmq1, json.coeff);

    return rsa;
}
function decrypt(group){

  chrome.storage.local.get(['user'],  function(result){
    if (result['user'] != undefined && result['user'] != null) {
      var user = result['user']['user'];
      var rsaKey = RSAParse(result['user']['key']);

      var getPost = document.getElementsByClassName("md")[1];
      var post = getPost.getElementsByTagName('p')[0].innerHTML;
      var xhr = new XMLHttpRequest();
      xhr.open("GET", "http://localhost:3000?action=301&user="+ user +"&group=" + group + "&text=" + encodeURIComponent(post), false);
      xhr.send();
      var resp = xhr.responseText;
      var result = cryptico.decrypt(resp, rsaKey).plaintext;
      document.getElementsByClassName("md")[1].getElementsByTagName('p')[0].innerHTML = result;
      document.getElementById("groupname-field").value = "";
  }
  else {
    alert("Please sign in");
  }
});
}
var groupInp = document.createElement("INPUT");// Create a <button> element
groupInp.setAttribute("type", "text");
groupInp.setAttribute("value", "group");
groupInp.setAttribute("id", "groupname-field");
document.getElementsByClassName("top-matter")[0].appendChild(groupInp);


var decryptBtn = document.createElement("LI");
decryptBtn.setAttribute("id", "decryptBtn");
decryptBtn.setAttribute("class", "crosspost-button");
var a = document.createElement("A");
a.setAttribute("id", "decryption");


a.innerHTML= "decrypt";
decryptBtn.appendChild(a);


document.getElementsByClassName("flat-list buttons")[0].appendChild(decryptBtn);
document.getElementById("decryption").addEventListener("click", function(){
  var group = document.getElementById("groupname-field").value;
  decrypt(group);

});
// var rsaKey = cryptico.generateRSAKey(PassPhrase, 2048);
// var getPost = document.getElementsByClassName("md")[1];
// var post = getPost.getElementsByTagName('p')[0].innerHTML;
// var xhr = new XMLHttpRequest();
// xhr.open("GET", "http://localhost:3000?action=301&user=test&group=test&text=" + encodeURIComponent(post), false);
// xhr.send();
// var resp = xhr.responseText;
// console.log(resp)
// var result = cryptico.decrypt(resp, rsaKey).plaintext;
// console.log(result);
// document.getElementsByClassName("md")[1].getElementsByTagName('p')[0].innerHTML = result;
