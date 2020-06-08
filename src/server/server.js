import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import Config from './config.json';
import Web3 from 'web3';
import express from 'express';


let config = Config['localhost'];
let web3 = new Web3(new Web3.providers.WebsocketProvider(config.url.replace('http', 'ws')));
web3.eth.defaultAccount = web3.eth.accounts[0];
let flightSuretyApp = new web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);
const oracles = []

function registerOracles(accounts) {
  let fee = web3.utils.toWei('1', 'ether')
  accounts.forEach( (oracle) => {
    console.log('Registrating: ', oracle)
    flightSuretyApp.methods.registerOracle().send({ from: oracle, value: fee, gas: 3000000 }, (err) => {
      if (err) return console.log(err)
      flightSuretyApp.methods.getMyIndexes().call({ from: oracle }, (err, result) => {
        if (err) return console.log(err)
        oracles.push([ result[0], result[1], result[3] ])
        console.log(`Oracle Registered: ${result[0]}, ${result[1]}, ${result[2]}`)
      })
    })
  })
}

flightSuretyApp.events.OracleRequest({ fromBlock: 0 }, function (error, event) {
  if (error) console.log(error)
  console.log('########## Oracle Request Event Emitted #######################################')
});

const app = express();
web3.eth.personal.getAccounts().then(registerOracles);

app.get('/api', (req, res) => {
  res.send({
    message: 'An API for use with your Dapp!'
  })
})


export default app;


