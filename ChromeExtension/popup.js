// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

// cryptico library

// popup


cryptico.generateRSAKey("test", 1024);
function encrypt(form){
	alert("You have been encrypted");
}
function decrypt(form){
	alert("You have been decrypted");
}

var myForm = document.getElementById("EncryptForm");
myForm.addEventListener('submit', function (evt) { encrypt(evt);});

