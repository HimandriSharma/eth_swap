import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';
import Token from '../abis/Token.json';
import EthSwap from '../abis/EthSwap.json';
import Navbar from './Navbar';
import Main from './Main';

class App extends Component {

  async componentWillMount(){
    await this.loadWeb3()
    await this.loadBlockChainData()
  }
  async loadBlockChainData(){
    const web3 = window.web3
    
    const accounts = await web3.eth.getAccounts()
    this.setState({account:accounts[0]})

    const ethBalance = await web3.eth.getBalance(this.state.account)
    this.setState({ethBalance})
    
    //Load Token
    const networkId = await web3.eth.net.getId()
    const tokenData = Token.networks[networkId]
    if(tokenData){
      const token = new web3.eth.Contract(Token.abi, tokenData.address)
      this.setState({token})
      // let tokenBalance = await token.methods.balanceOf(this.state.account).call({from: this.state.account})
      // console.log(tokenBalance)
      // console.log("tokenBalance", tokenBalance.toString())
      // this.setState({ tokenBalance: tokenBalance.toString() })
    }
    else{
      window.alert('Token contract not deployed to detected network.')
    }

    //Load EthSwap
    const ethSwapData = Token.networks[networkId]
    if(ethSwapData){
      const ethSwap = new web3.eth.Contract(Token.abi, tokenData.address)
      this.setState({ethSwap})
      // let tokenBalance = await token.methods.balanceOf(this.state.account).call({from: this.state.account})
      // console.log(tokenBalance)
      // console.log("tokenBalance", tokenBalance.toString())
      // this.setState({ tokenBalance: tokenBalance.toString() })
    }
    else{
      window.alert('EthSwap contract not deployed to detected network.')
    }

    this.setState({loading:false})
  }

  constructor(props){
    super(props)
    this.state = {
      account : '',
      token: {},
      ethSwap: {},
      ethBalance : '0',
      tokenBalance : '0',
      loading : true,
    }
  }

  async loadWeb3() {
    if(window.ethereum){
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3){
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else{
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }
  render() {
    let content
    if(this.state.loading){
      content = <p id="loader" className="text-center">Loading...</p>
    }
    else{
      content = <Main/>
    }
    return (
      <div>
        <Navbar account={this.state.account}/>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{maxWidth:'600px'}}>
              <div className="content mr-auto ml-auto">
              {content}
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
