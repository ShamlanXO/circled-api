import React, { Component } from "react";

import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

export default function (Conmponent) {
  class Authenticate extends Component {
    componentDidMount = () => {
      if (!this.props.login) {
        this.props.history.push("/");
      }
    };

    render() {
      return <>{this.props.login && <Conmponent {...this.props} />}</>;
    }
  }

  const mapStateToProps = (state) => {
    return {
      login: state.Profile.token ? true : false,
    };
  };

  return connect(mapStateToProps, {})(withRouter(Authenticate));
}
