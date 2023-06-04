import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

// Components
import Navigation from './components/Navigation'
import Section from './components/Section'
import Product from './components/Product'

// ABIs
import Dappazon from './abis/Dappazon.json'

// Config
import config from './config.json'

function App() {
  const [provider, setProvider] = useState(null)
  const [dappazon, setDappazon] = useState(null)

  const [account, setAccount] = useState(null)

  const [electronics, setElectronics] = useState(null)
  const [clothing, setCLothing] = useState(null)
  const [toys, setToys] = useState(null)

  const [item, setItem] = useState({})
  const [toggle, setToggle] = useState(false)

  const togglePop = (item) => {
    setItem(item)
    toggle ? setToggle(false) : setToggle(true)
  }

  const loadBlockchainData = async () => {
    // Connect to blockchain
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)

    const network = await provider.getNetwork()
    console.log(network)
    
    // Connect to smart contracts (Create JS version)
    const dappazon = new ethers.Contract(
      config[network.chainId].dappazon.address,
      Dappazon,
      provider
    )
    setDappazon(dappazon)

    // Load products

    const items = []
    for(var i = 0; i < 9; i++) {
      const item = await dappazon.items(i+1)
      items.push(item)
    }

    const electronics = items.filter((items) => items.category === 'electronics')
    const clothing = items.filter((items) => items.category === 'clothing')
    const toys = items.filter((items) => items.category === 'toys')

    setElectronics(electronics)
    setCLothing(clothing)
    setToys(toys)
  }

  useEffect(() => {
    loadBlockchainData()
  },[])

  return (
    <div>
      <Navigation account={account} setAccount={setAccount}/>
      <h2>Dappazon Best Sellers</h2>

      {electronics && clothing && toys && (
        <>
          <Section title={"Clothing & Jewelry"} items={clothing} togglePop={togglePop}/>
          <Section title={"Electronics & Gadgets"} items={electronics} togglePop={togglePop}/>
          <Section title={"Toys & Gaming"} items={toys} togglePop={togglePop}/>
        </>
      )}

      {toggle && (
        <Product item={item} togglePop={togglePop} account={account} dappazon={dappazon} provider={provider}/>
      )}
      
    </div>
  );
}

export default App;
