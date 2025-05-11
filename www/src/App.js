import './App.css';
import React, { useEffect } from 'react';
import init, {r_load_tx} from "btc-inspect";
import { useState } from 'react';

function App() {
  const [raw, setRaw] = useState("")
  useEffect(() => {
    const runWasm = async () => {
      await init();
    };
    runWasm();
  }, []);

  function handleFetch() {
    var tx = r_load_tx("044cfbd82d5cc479aba7df00c3c066a6052ce4da6d8af9d5fa8f229d35919644")
    setRaw(tx.r_tx_raw())
  }
    function handleClear() {
        setRaw("")
    }
  return (
    <div className="App">
        <div className="Header">
            <input className="Input"
                   value="044cfbd82d5cc479aba7df00c3c066a6052ce4da6d8af9d5fa8f229d35919644"
                   placeholder={"Transaction ID"}
            />
        </div>

        <button className="Button" onClick={() => handleFetch()} >
          Fetch Transaction
        </button>
        <button className="Button" onClick={() => handleClear()} >
            Clear
        </button>
        <p>
          {raw}
        </p>
    </div>
  );
}

export default App;
