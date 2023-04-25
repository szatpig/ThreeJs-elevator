import { useEffect, useState } from "react";
import "./App.css";

import Elevator from "./elevator";

function App() {
  const [elevator] = useState(() => {
    const _elevator = new Elevator();
    return _elevator;
  });
  useEffect(() => {
    elevator.init();
  }, []);

  return <div className="App" id="app"></div>;
}

export default App;
