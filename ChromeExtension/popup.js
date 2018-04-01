// Copyright 2018 The Chromium Authors. All rights reserved.  Use of
// this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
var cryptico = require('cryptico');
'use strict';
function loadPage(href) {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET", href, false);
	xmlhttp.send();
	return xmlhttp.responseText;
}

function RSAParse(rsaString) {
    var json = JSON.parse(rsaString);
    var rsa = new cryptico.RSAKey();

    rsa.setPrivateEx(json.n, json.e, json.d, json.p, json.q, json.dmp1, json.dmq1, json.coeff);

    return rsa;
}
function serverReq(data){
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET", "http://localhost:3000/?" + data, false);
	xmlhttp.send();
	return xmlhttp.responseText;

}

function back(){

	document.getElementById("action").innerHTML=loadPage("action.html");
	document.getElementById("login").onclick = login_page;
	document.getElementById("mkgrp").onclick = mkgrp;
	document.getElementById("rmgrp").onclick = rmgrp;
	document.getElementById("delgrp").onclick = delgrp;
	document.getElementById("adduser").onclick = addgrp;
	document.getElementById("logout").onclick = logout;
	document.getElementById('pubKey').onclick = getPublicKey;
}

function login_page(){
	document.getElementById("action").innerHTML=loadPage("login.html");
	document.getElementById('loginForm').onclick = login;
	document.getElementById("back").onclick = back;

}

function mkgrp(){
	document.getElementById("action").innerHTML=loadPage("mkgrp.html");
	document.getElementById('groupForm').onclick = createGroup;
	document.getElementById("back").onclick = back;

}

function createGroup(){
	var group = document.getElementById("groupname").value;
	if(group != ""){
		chrome.storage.local.get(['user'], function(result){
			if (result['user'] != undefined && result['user'] != null) {
				var user = result['user']['user'];
				var key = cryptico.publicKeyString(RSAParse(result['user']['key']));

				var data = "action=202&user="+ user + "&pubKey=" + encodeURIComponent(key) + "&group=" + group;
				alert(serverReq(data));
				back();
			}
			else {
				alert("Please login");
				login_page();
			}
		});
	}
	else {
		alert("Please enter group name");
		mkgrp();
	}

}

function rmgrp(){
	document.getElementById("action").innerHTML=loadPage("rmgrp.html");
	document.getElementById("removeForm").onclick = removeFromGroup;
	document.getElementById("back").onclick = back;

}
function removeFromGroup(){
	var user = document.getElementById("username").value;
	var group = document.getElementById("groupname").value;
	if(user != "" && group != ""){
		chrome.storage.local.get(['user'], function(result){
			if (result['user'] != undefined && result['user'] != null) {
				var admin = result['user']['user'];
				var data = "action=207&admin="+ admin + "&group=" + group +
				"&user=" +user;
				alert(serverReq(data));
			}
			else {
				alert("Please login");
				login_page();
			}
		});

	}
	else {
		alert("Please fill out all fields");

	}
}
function addgrp(){
	document.getElementById("action").innerHTML=loadPage("adduser.html");
	document.getElementById("removeForm").onclick = addToGroup;
	document.getElementById("back").onclick = back;

}
function addToGroup(){
	var user = document.getElementById("username").value;
	var group = document.getElementById("groupname").value;
	var key = document.getElementById("pubKey").value;
	if(user != "" && group != ""){
		chrome.storage.local.get(['user'], function(result){
			if (result['user'] != undefined && result['user'] != null) {
				var admin = result['user']['user'];
				var data = "action=206&admin="+ admin + "&group=" + group +
				"&user=" +user + "&key=" + encodeURIComponent(key);
				alert(serverReq(data));
			}
			else {
				alert("Please login");
				login_page();
			}
		});

	}
	else {
		alert("Please fill out all fields");

	}
}

function delgrp(){
	document.getElementById("action").innerHTML=loadPage("delgrp.html");
	document.getElementById("delForm").onclick = deleteGroup;
	document.getElementById("back").onclick = back;
}

function deleteGroup(){
	var group = document.getElementById("groupname").value;
	if(group != ""){
		chrome.storage.local.get(['user'], function(result){
			if (result['user'] != undefined && result['user'] != null) {
				var user = result['user']['user'];
				var data = "action=205&admin="+ user + "&group=" + group;
				alert(serverReq(data));
				back();
			}
			else {
				alert("Please login");
				login_page();
			}
		});
	}
	else {
		alert("Please enter group name");
		mkgrp();
	}

}



function logout(){
	chrome.storage.local.set({'user':null}, function(){
		alert("You have been logged out");

	});
	chrome.storage.sync.set({'user':null}, function(){

	});
	back();
}

function login(){
	console.log("got here");
	var user = document.getElementById("username").value;
	var pass = document.getElementById("passphrase").value;
	if (user == null || user=="" || pass==null || pass==""){
		login_page();
		return null;
	}
	var username ="";
	var passphrase = "";
	chrome.storage.local.get(['user'], function(result) {

		username = user;
		passphrase = pass;
		var key = JSON.stringify(cryptico.generateRSAKey(passphrase, 2048).toJSON());
		var details = {'key': key, 'pass':passphrase, 'user':username};
		chrome.storage.local.set({'user':{'key':key,'pass':pass,'user':user}},function() {
			console.log("Logged in");
			back();
		});
  });
}

function getPublicKey(){
	chrome.storage.local.get(['user'], function(result){
		if (result['user'] != undefined && result['user'] != null) {
			alert(cryptico.publicKeyString(RSAParse(result['user']['key'])));
			back();
		}
		else {
			alert("Please login");
			login_page();
		}
	});


}

back();
