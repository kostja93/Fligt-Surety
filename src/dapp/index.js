
import DOM from './dom';
import Contract from './contract';
import './flightsurety.css';

let contract;

(async() => {

    let result = null;

    contract = new Contract('localhost', () => {
        const flights = [
          { airline: contract.airlines[0], flight: 'ND 1801', timestamp: Math.floor(Date.now()/1000), state: 0 },
          { airline: contract.airlines[0], flight: 'ND 1802', timestamp: Math.floor(Date.now()/1000), state: 0 },
          { airline: contract.airlines[0], flight: 'ND 1803', timestamp: Math.floor(Date.now()/1000), state: 0 },
          { airline: contract.airlines[0], flight: 'ND 1804', timestamp: Math.floor(Date.now()/1000), state: 0 },
          { airline: contract.airlines[0], flight: 'ND 1805', timestamp: Math.floor(Date.now()/1000), state: 0 },
        ]

        displayFlights(flights)

        // Read transaction
        contract.isOperational((error, result) => {
            console.log(error,result);
            display('Operational Status', 'Check if contract is operational', [ { label: 'Operational Status', error: error, value: result} ]);
        });
    

        // User-submitted transaction
        DOM.elid('submit-oracle').addEventListener('click', () => {
            let flight = DOM.elid('flight-number').value;
            // Write transaction
            contract.fetchFlightStatus(flight, (error, result) => {
                display('Oracles', 'Trigger oracles', [ { label: 'Fetch Flight Status', error: error, value: result.flight + ' ' + result.timestamp} ]);
            });
        })
    
    });
    

})();


function display(title, description, results) {
    let displayDiv = DOM.elid("display-wrapper");
    let section = DOM.section();
    section.appendChild(DOM.h2(title));
    section.appendChild(DOM.h5(description));
    results.map((result) => {
        let row = section.appendChild(DOM.div({className:'row'}));
        row.appendChild(DOM.div({className: 'col-sm-4 field'}, result.label));
        row.appendChild(DOM.div({className: 'col-sm-8 field-value'}, result.error ? String(result.error) : String(result.value)));
        section.appendChild(row);
    })
    displayDiv.append(section);
}

function buyFlight(flight) {
  contract.buy(flight);
}

function displayFlights(flights) {
    let displayDiv = DOM.elid("display-wrapper");
    let section = DOM.section();
    section.appendChild(DOM.h2('Flights'));
    flights.map((result) => {
        let row = section.appendChild(DOM.div({className:'row'}));
        let buy = DOM.button({ onclick: function(){ buyFlight(result) } }, 'Buy')
        let buttons = DOM.div({className: 'col-sm-3'})
        buttons.appendChild(buy)
        row.appendChild(DOM.div({className: 'col-sm-3'}, result.flight));
        row.appendChild(DOM.div({className: 'col-sm-3'}, result.timestamp));
        row.appendChild(DOM.div({className: 'col-sm-3'}, result.state.toString()));
        row.appendChild(buttons);
        section.appendChild(row);
    })
    displayDiv.append(section);
}
