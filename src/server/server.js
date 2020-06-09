import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import Config from './config.json';
import Web3 from 'web3';
import express from 'express';


let config = Config['localhost'];
let web3 = new Web3(new Web3.providers.WebsocketProvider(config.url.replace('http', 'ws')));
web3.eth.defaultAccount = web3.eth.accounts[0];
let flightSuretyApp = new web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);
const oracles = []
const flightStatuses = [10, 20, 30, 40, 50]

function registerOracles(accounts) {
  let fee = web3.utils.toWei('1', 'ether')
  accounts.forEach( (oracle) => {
    console.log('Registrating: ', oracle)
    flightSuretyApp.methods.registerOracle().send({ from: oracle, value: fee, gas: 3000000 }, (err) => {
      if (err) return console.log(err)
      flightSuretyApp.methods.getMyIndexes().call({ from: oracle }, (err, result) => {
        if (err) return console.log(err)
        oracles.push([ oracle, result[0], result[1], result[2] ])
        console.log(`Oracle Registered: ${result[0]}, ${result[1]}, ${result[2]}`)
      })
    })
  })
}

function fetchFlightStatus(event) {
  const { airline, flight, timestamp, index } = event.returnValues
  const flightStatus = flightStatuses[ Math.floor( Math.random() * 5 ) ]
  const oracle = oracles.find(o => o[1] == index || o[2] == index || o[3] == index)[0]
  flightSuretyApp.methods.submitOracleResponse(index, airline, flight, timestamp, flightStatus).send({ from: oracle });
  console.log(oracle, flightStatus)
  console.log('########## Updated flight status ##############################################')
}

flightSuretyApp.events.OracleRequest({ fromBlock: 0 }, function (error, event) {
  if (error) console.log(error)
  console.log('########## Oracle Request Event Emitted #######################################')
  fetchFlightStatus(event)
});

const app = express();
web3.eth.personal.getAccounts().then(registerOracles);

app.get('/api', (req, res) => {
  res.send({
    message: 'An API for use with your Dapp!'
  })
})


export default app;


