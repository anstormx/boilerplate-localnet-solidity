const assert = require('assert'); //stdlib
//used for making assertions about tests

const ganache = require('ganache');

const { Web3 } = require('web3'); //constructor function hence first letter capitalized
//used to create instances of web3 library
//purpose of each instance is to connect to a different ethereum network   

const web3 = new Web3(ganache.provider());
//tells the instance to connect to the local ethereum network

const { interface, bytecode } = require('../compile');  
//importing interface and bytecode from compile.js file

let accounts;
//create a global variable so that the 'it' block inside describe can get access
let inbox;
//contains the contract object

beforeEach(async () => {
    accounts = await web3.eth.getAccounts() //async/await is used to make it look synchronous
    //get a list of the accounts on ganache
    //the web3 instance has many different modules assigned to it which can be used to work 
    //with different types of cryptocurrencies, here we are accessing the eth module
    //on this module we are accessing the getAccounts function
    
    inbox = await new web3.eth.Contract(JSON.parse(interface)) 
    //accessing the Contract constructor function from eth module, helps us to interact with existing contracts on the blockchain
    //or create and deploy new contract
    //the JSON.parse function is used to convert the stringified JSON type of ABI into a javascript object
        .deploy({ data: bytecode, arguments: ['hello']})
        //argument which we want to pass into the constructor function of the contract to 
        //assign some value to the message variable
        //creates the contract
        .send({ from: accounts[0], gas: '1000000' });
        //use first account from the accounts array to deploy the contract and create a transaction
        //gasLimit = 1000000
        //creates a transaction so that the contract is deployed on the blockchain

});

describe('Inbox', () => {
    it('contract deployed successfully', () => {
        assert.ok(inbox.options.address);
        //tells if the contract has an address or not
    })
    it('default message set', async () => {
        const message = await inbox.methods.message().call();
        //the contract has an object called methods which contains all the public functions that exist in the contract
        //here we are calling the message function which returns the value of the message variable
        //calling a method on contract

        assert.equal(message , 'hello');
        //checking if message is equal to 'hello'
    })
    it('set message working', async () => {
        await inbox.methods.setMessage('bye').send({ from: accounts[0] });
        //returns the transaction hash which we dont need
        //send() is used to customize the transaction that we are sending to the network
        
        const message = await inbox.methods.message().call();
        assert.equal(message , 'bye');
    })
});