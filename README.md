# Running instance at:  
##http://block-chain-client1.westeurope.cloudapp.azure.com

# block-chain-app

# Technologies used:

##web3 version .19
Used to communicate with the ethereum block chain and contracts using the Generic JSON RPC

##Node.js
Used on the Raspberry pi to run scripts used to communicate with the NFC scanner
###mfrc522 library
Used to communicate with the RFIO RC522 NFC scanner hardware

##Meteor
Used to create the web front end that interacts with the orders Ethereum contract

##MongoDB
Caches the orders from the Ethereum orders contract

##Raspberry Pi Model 3 (Wifi model)
Using the Pi's GPIO SPI interface to communicate with the NFC/RFID tag reader hardware

##Remix web based Solidity IDE
https://ethereum.github.io/browser-solidity
Used to edit, debug, compile, and prepare the web deployment script

##GETH
Used to deploy the compiled solidity code and interact with the Ethereum transaction node.

##MS Azure Ethereum Consortium
Created simple three server private Ethereum network with two miners and one transaction node.  Also created a fourth Ubuntu VM to host the Meteor contract app

#Project files:

##pi folder
###scan_ids.js
This script poles the NFC scanner hardware waiting for a card/tag to be read.  Once it reads the tag, it takes the unique ID from the tag and creates a contract order, then
pushes the order to the Ethereum contract

##sol folder
###orders_contract.sol
The solidity orders contract

##dapp folder
###orders.js
The Meteor client + server script used to display the Ethereum contract orders.  It subscribes to the contract's events and displays each new order as their mined by the Ethereum miners.

###orders.html
The Meteor HTML template that rendres a simple HTML table to display the submitted orders

###lib/init.js
The Meteor configuration file containing the path to the Ethereum transaction node