import React from "react";
import ReactDOM from "react-dom";
// import "antd/dist/antd.css";

import Machine from "./components/machine";

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <div>
          <Machine />
        </div>
      </div>
    );
  }
}

ReactDOM.render(
    <App />,
  document.getElementById("root")
);
