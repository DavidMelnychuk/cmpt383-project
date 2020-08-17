import React from "react";
import { css } from "@emotion/core";
import HashLoader
from "react-spinners/HashLoader";
 

class AwesomeComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }
 
  render() {
    return (
      <div className="sweet-loading">
        <HashLoader
          size={20}
          color={"#74B0F7"}
          loading={this.state.loading}
        />
      </div>
    );
  }
}

export default AwesomeComponent