
Orders = new Mongo.Collection('orders');

if(Meteor.isClient) {

	var contractAddress = "0x010cd532868119c0e3e5bb162b23e310446e5f96";
	
	orderContract = web3.eth.contract([{"constant":false,"inputs":[{"name":"product","type":"string"}],"name":"createOrder","outputs":[{"name":"_result","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getAllOrderIds","outputs":[{"name":"_orders","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getOrderCount","outputs":[{"name":"_orderCount","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"orders","outputs":[{"name":"id","type":"uint256"},{"name":"product","type":"string"},{"name":"buyer","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":false,"name":"id","type":"uint256"},{"indexed":false,"name":"product","type":"string"}],"name":"SetEvent","type":"event"}]).at(contractAddress);

	Meteor.startup(function () {

		var orderList = orderContract.getAllOrderIds();

		for (id in orderList) {

			var retrievedOrder = orderContract.orders(id);
			
			if(retrievedOrder) {
				console.log(retrievedOrder);

				Orders.upsert({
				    _id: id,
				}, {
				    $set: {
				    	orderId: Number(id),
						product: retrievedOrder[1],
						from: retrievedOrder[2],
					}
				});
			}
			
		}
	});	

	Template.orders.onCreated(function ordersCreated() {

    	console.log("init done");
  	});    


	var event = orderContract.SetEvent();

	event.watch(function(error, result){
	    if (!error) {
			Orders.insert({
				orderId: result.args.id.toNumber(),
				product: result.args.product,
				from: result.args.from,
				_id: result.args.id.toNumber().toString()

			});

			console.log(result.args);
	    } else {
	        console.log(error);  
	    }
	});

	Template.orders.helpers({

	    'order': function(){
	        return Orders.find({}, { sort: {orderId: 1} });
	    },
	});
}
