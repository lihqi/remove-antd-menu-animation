import React from "react";

import "./App.css";
import Sider from "./Sider";
let types = [1, 2];
function App() {
    return (
        <div className="App">
            {types.map(item => {
                return <Sider type={item} key={item} />;
            })}
        </div>
    );
}

export default App;
