var cryptico = require("cryptico");


var getKey = new  XMLHttpRequest();
getKey.open("GET", "http://localhost:3000?action=100", false);
getKey.send();
cryptico;
var key = getKey.responseText;
console.log("Server key is " + key);
var btn = document.createElement("BUTTON");// Create a <button> element
btn.setAttribute("type", "button");
btn.setAttribute("id", "myBtn");
var t = document.createTextNode("Encrypt");       // Create a text node
btn.appendChild(t);
var userInp  = document.createElement("INPUT");// Create a <button> element
userInp.setAttribute("type", "text");
userInp.setAttribute("value", "user");

userInp.setAttribute("id", "username-field");

var groupInp = document.createElement("INPUT");// Create a <button> element
groupInp.setAttribute("type", "text");
groupInp.setAttribute("value", "group");
groupInp.setAttribute("id", "groupname-field");


document.getElementById("text-field").appendChild(btn);
document.getElementById("text-field").appendChild(userInp);
document.getElementById("text-field").appendChild(groupInp);

document.getElementById("myBtn").addEventListener("click", function(){

	var user = document.getElementById("username-field").value;
	var group = document.getElementById("groupname-field").value;
	
	var text = document.getElementsByName("text")[0].value;
	var cipher = cryptico.encrypt(text, key).cipher;
	var xhr = new XMLHttpRequest()
	xhr.open("GET", "http://localhost:3000?action=300&user=" + user + "&group=" + group  +"&text=" + encodeURIComponent(cipher), false);
	xhr.send();
	var result = xhr.responseText;
	console.log(result);
	if(result == "invalid details "){
		alert("Invalid details for encryption");
	}
	else{
		document.getElementsByName("text")[0].value = result;
	}
});
