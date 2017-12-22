"use strict";

var util = require('util')
var Web3 = require('web3');
const mfrc522 = require("./../index");

var web3 = new Web3(new Web3.providers.HttpProvider("http://blkchngkad57.westeurope.cloudapp.azure.com:8545"));

var contractAddress = "0x010cd532868119c0e3e5bb162b23e310446e5f96";

var order = web3.eth.contract([{"constant":false,"inputs":[{"name":"product","type":"string"}],"name":"createOrder","outputs":[{"name":"_result","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getAllOrderIds","outputs":[{"name":"_orders","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getOrderCount","outputs":[{"name":"_orderCount","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"orders","outputs":[{"name":"id","type":"uint256"},{"name":"product","type":"string"},{"name":"buyer","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":false,"name":"id","type":"uint256"},{"indexed":false,"name":"product","type":"string"}],"name":"SetEvent","type":"event"}]).at(contractAddress);

//# Init WiringPi with SPI Channel 0
mfrc522.initWiringPi(0);

//# This loop keeps checking for chips. If one is near it will get the UID and authenticate
console.log("scanning...");
console.log("Please put chip or keycard in the antenna inductive zone!");
console.log("Press Ctrl-C to stop.");

setInterval(function(){

    //# reset card
    mfrc522.reset();

    //# Scan for cards
    let response = mfrc522.findCard();
    if (!response.status) {
        console.log("Waiting for scan...");
        return;
    }
    
    console.log("Card detected, CardType: " + response.bitSize);

    //# Get the UID of the card
    response = mfrc522.getUid();
    if (!response.status) {
        console.log("UID Scan Error");
        return;
    }

    //# If we have the UID, continue
    var uid = response.data;
    var productCode = uid[0].toString(16) + uid[1].toString(16) + uid[2].toString(16) + uid[3].toString(16);
    var orderLine = "Order date: " + formatDate(new Date()) + " Product code: " + productCode;

    console.log(orderLine);

    order.createOrder(orderLine, {from: web3.eth.coinbase, gas: 1000000});

}, 500);

function formatDate(date) {
  var monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];

  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();
  var hours = pad(date.getHours(), 2);
  var minutes = pad(date.getMinutes(), 2);
  var seconds = pad(date.getSeconds(), 2);

  return day + ' ' + monthNames[monthIndex] + ' ' + year + ' ' + hours + ':' + minutes + ':' + seconds;
}


function pad(num, size) {
    var s = "000000000" + num;
    return s.substr(s.length-size);
}