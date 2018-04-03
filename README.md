# Secure social media 
This repo contains a way of encrypting reddit posts and only allowing certain users to view them. Contains server written in nodejs and chrome extension which does:

* Encrypting/Decrypting posts
* Make/Delete groups
* Add or remove users from groups

Requires folloing libraries:

* crypto js
* cryptico
* browserify


In order to run the server program on windows enter this command in this directory
```
node server.js
```
## Installation
```
npm i crypto-js
```
```
npm i cryptico
```

```
npm i -g browserify
```

### Generate browserified files
```
browserify popup.js > popup_bundle.js
```

```
browserify content.js > bundle.js
```


```
browserify decrypt.js > bundle2.js
```

## Content

### server.js
![Server](https://www.techdonut.co.uk/sites/default/files/managed-server-hosting-your-server-in-the-cloud-523968604.jpg)
Does exactly what it says on the tin. Uses the cryptico and http libraries in nodejs to implement a basic server which takes HTTP requests and encrypts and decrypts messages. As well as creating and deleting groups, adding or removing users. Has rsa key plaintext sent to t should be encrypted with it's public key and plaintext to be sent to user will be encrypted with user's public key. Uses aes random aes key for each group. Group is a javascript object and maps a group name to another javascript object which contains the users and their roles and public keys. Users can only be added or removed by admins, admins are the users who create the group.

### Chrome Extension
CUrrently only setup to ping localhost for encryption and decryption so if you want this to function for multiple users you will have to run it on a server and change the references to localhost within the chrome extension.

### ChromeExtension/manifest.json
setup for extension

