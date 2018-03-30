var cryptico = require('cryptico');
var PassPhrase = "Don't fear the reaper";
var rsaKey = cryptico.generateRSAKey(PassPhrase, 2048);
var getPost = document.getElementsByClassName("md")[1];
var post = getPost.getElementsByTagName('p')[0].innerHTML;
var xhr = new XMLHttpRequest();
xhr.open("GET", "http://localhost:3000?action=301&user=test&group=test&text=" + encodeURIComponent(post), false);
xhr.send();
var resp = xhr.responseText;
console.log(resp)
var result = cryptico.decrypt(resp, rsaKey).plaintext;
console.log(result);
document.getElementsByClassName("md")[1].getElementsByTagName('p')[0].innerHTML = result;
