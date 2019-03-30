import React, { Component } from 'react';
import './App.css';
import MetaMaskDecorator from './libs/meta_mask_decorator/MetaMaskDecorator';
import ContactFactory from './libs/meta_mask_decorator/ContactFactory';
import Ico from "./contracts/Ico";

const artifacts = { Ico };
const mmd = new MetaMaskDecorator({ debug: 1 });
const contractFactory = new ContactFactory({ mmd, artifacts });

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            icoAddress: null,
            userAddress: null,
            networkName: null,
            myWishedAmount: null,
            endDate: null
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

        // read
        ico.endDate.call((error, result) => {
            console.log(error, result);
            var date = new Date(result * 1000);
            this.setState({ endDate: date.toString() })
        });

        // subscribe to event
        const eventWatcher = ico.Transfer({
            fromBlock: 0,
            toBlock: 100
        });
        console.log("eventWatcher", eventWatcher);
        eventWatcher.on("data", (error, result) => {
            console.log("EVENT!!!", error, result);
        });

        // read wish list
        // ico.wishList.call((e,d) => {
        //   console.log("wl", e,d);
        // })
        // read wish list 2
        ico.getMyWishListAmount((e,d) => {
            console.log("wl", e,d);
        })
        ;
        // save ico contract instane for future usage
        this.ico = ico;
    };

    onSubmit = (data) => {
        console.log(data.amount);
        this.ico.addMeToWishList(data.amount);
    };

    render() {
        const { networkName, userAddress, icoAddress, endDate, myWishedAmount } = this.state;
        return (
            <div>
                <h1>ETH (networkName: {networkName}, userAddress: {userAddress}, icoAddress: {icoAddress})</h1>
                <p> End date is :  {endDate} </p>

                <div>My myWishedAmount: {myWishedAmount}</div>
                <button onClick={this.onSubmit}>send ETH: </button>
            </div>
        );
    }
}

export default App;
