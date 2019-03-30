import React, { Component } from 'react';
import './App.css';
import MetaMaskDecorator from './libs/meta_mask_decorator/MetaMaskDecorator';
import ContactFactory from './libs/meta_mask_decorator/ContactFactory';
import Ico from "./contracts/Ico";

const artifacts = { Ico };
const mmd = new MetaMaskDecorator({ debug: 0 });
const contractFactory = new ContactFactory({ mmd, artifacts });

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            icoAddress: null,
            userAddress: null,
            networkName: null,
            myWishedAmount: null,
            endDate: null,
            lastEvent: null,
        };
    }

    componentDidMount() {
        /**
         * wait until:
         * 1. Meta Mask chrome is installed and activated
         * 2. network selected
         * 3. user selected
         */
        mmd.$when('isFullyReady')
        .then(() => {
            this.setState({
                userAddress: mmd.state.userAddress,
                networkName: mmd.state.networkName,
            });
            return contractFactory.createInstanceForCurrentUser("Ico");
        })
        .then((ico) => {
            this.onMmdReady(ico);
        });
        ;
    }

    onMmdReady = (ico) => {
        console.log(ico);

        this.setState({
            icoAddress: ico.address,
        });

        // read public property
        ico.endDate.call((error, result) => {
            console.log(error, result);
            var date = new Date(result * 1000);
            this.setState({ endDate: date.toString() })
        });

        // subscribe to event
        const eventWatcher = ico.Transfer({
            fromBlock: 0, // TODO start from (see event handler below) result.blockNumber
            toBlock: 100
        });

        eventWatcher.on("data", (result, error) => {
            console.log("EVENT!!!", error, result);
            // TODO track result.blockNumber
            const from = result.args.from;
            const to = result.args.to;
            const amount = result.args.amount;
            this.refreshUserBalance();
            alert(`ETH has just been sent to contract. ${from} -> ${to}: ${amount}`);
        });

        // save ico contract instane for future usage
        this.ico = ico;
    };

    refreshUserBalance = () => {
        this.ico.getBalance(this.state.userAddress, (error, amountInWei) => {
            console.log("wl", error,amountInWei);
            this.setState({myWishedAmount: parseInt(amountInWei, 10)});
        });
    };

    send777 = () => {
        this.ico.transferMyTokens(777, "0x355C264d6d992c8CBf82DED1Da327ac10A613dBD");
    };

    render() {
        const { networkName, userAddress, icoAddress, endDate, myWishedAmount } = this.state;
        return (
            <div>
                <h1>ETH (networkName: {networkName}, userAddress: {userAddress}, icoAddress: {icoAddress})</h1>
                <p> End date is :  {endDate} </p>
                <div>My amount: {myWishedAmount}</div>
                <div>To get more balance - send ETH to contract (do not forget to increase gas limit)</div>
                <button onClick={this.send777}>Send 777 to my friend</button>
            </div>
        );
    }
}

export default App;
