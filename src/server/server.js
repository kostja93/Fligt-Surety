import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import Config from './config.json';
import Web3 from 'web3';
import express from 'express';


let config = Config['localhost'];
let web3 = new Web3(new Web3.providers.WebsocketProvider(config.url.replace('http', 'ws')));
web3.eth.defaultAccount = web3.eth.accounts[0];
let flightSuretyApp = new web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);

async function registerOracles() {
  for(i = 0; i < 10; i++) {
    let oracle = web3.eth.accounts[i + 1]
    let fee = web3.utils.toWei('1', 'ether')
    await flightSuretyApp.registerOracle({ from: oracle, value: fee })
    let result = await flightSuretyApp.getMyIndexes.call({ from: oracle })
    console.log(`Oracle Registered: ${result[0]}, ${result[1]}, ${result[2]}`)
  }
}

flightSuretyApp.events.OracleRequest({ fromBlock: 0 }, function (error, event) {
  if (error) console.log(error)
  console.log('########## Oracle Request Event Emitted #######################################')
});

const app = express();
app.get('/api', (req, res) => {
    res.send({
      message: 'An API for use with your Dapp!'
    })
})

export default app;


