import './App.css';
import React, { useEffect } from 'react';
import init, {r_try_command, r_tx_json} from "btc-inspect";
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
    var raw = r_try_command()
    setRaw(raw)
  }
    function handleClear() {
        setRaw("")
    }
  return (
    <div className="App">
        <div className="Header">
            <input className="Input"
                   placeholder={"Transaction ID"}
            />
        </div>
        <button className="Button" onClick={() => handleFetch()} >
          Fetch Transaction
        </button>
        <button className="Button" onClick={() => handleClear()} >
            Clear
        </button>
        <button className="Button" onClick={() => {
            let tx_json = JSON.parse(r_tx_json());
            console.log(tx_json);
        }} >
            json
        </button>
        <p>
          {raw}
        </p>
    </div>
  );
}

export default App;
