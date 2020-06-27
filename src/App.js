import React from "react";
import "./App.css";
import Ymap from "./components/Ymap";
import RouteList from "./components/RouteList";
import YSuggest from "./components/YSuggest";

function App() {
    return (
        <div className="App">
            <div className="wrapper">
                <div className="layout">
                    <div className="layout__main">
                        <Ymap height="100%" />
                        <div className="search">
                            <YSuggest />
                        </div>
                    </div>
                    <div className="layout__sidebar">
                        <RouteList />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
