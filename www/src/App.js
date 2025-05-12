import './App.css';
import React, { useEffect } from 'react';
import init, {r_try_command} from "btc-inspect";
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
        <p>
          {raw}
        </p>
    </div>
  );
}

export default App;
