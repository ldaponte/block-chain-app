pragma solidity ^0.4.19;

contract DemoOrder {
    
    uint private _nextOrder;
    bool private _lockNext;
    
    struct Order {
        uint id;
        string product;
        address buyer;
    }
    
    mapping (uint => Order) public orders;
    uint[] private _orderList;
    
    event SetEvent(
        address indexed from,
        uint id,
        string product
    );

    function getOrderCount() public constant returns(uint _orderCount) {
        return _orderList.length;
    }
    
    function getAllOrderIds() public constant returns(uint[] _orders){
        return _orderList;
    }
    
    function createOrder (string product) public returns(bool _result) {
        
        if(!_lockNext) {
            _lockNext = true;
            orders[_nextOrder].product = product;
            _orderList.push(_nextOrder);
            orders[_nextOrder].id = _nextOrder;
            orders[_nextOrder].buyer = msg.sender;
    
            SetEvent(msg.sender, _nextOrder, product);
            _nextOrder += 1;
            _lockNext = false;
            return true;
        } 
            
        revert();
        return false;
    } 
}