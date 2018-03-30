// Copyright 2018 The Chromium Authors. All rights reserved.  Use of
// this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';
function loadPage(href) {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET", href, false);
	xmlhttp.send();
	return xmlhttp.responseText;
}

function back(){
	document.write(loadPage("popup.html"));
}

function login_page(){
	document.getElementById("action").innerHTML = loadPage("login.html");
	document.getElementById("loginForm").onclick = login;
}
var value="world";
var key="hello";
chrome.storage.sync.set({key: value}, function() {
	console.log('Value is set to ' + value);
});
      

function login(){
	var user = document.getElementById("username").value;
	var group = document.getElementById("username").value;
	var pass = document.getElementById("passphrase").value;
	chrome.storage.sync.get(['passes'], function(result) {
        console.log('Value currently is ' + result);
    });
}

document.getElementById("login").onclick = login_page;

