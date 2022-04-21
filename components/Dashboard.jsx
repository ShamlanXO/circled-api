import React from "react";
import { div } from "admin-bro";
import { ViewHelpers, ApiClient } from "admin-bro";

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.h = new ViewHelpers();
    this.state = {
      data: {
        TotalUsers: 0,
        TotalPrelimsSeries: 0,
        TotalMainsSeries: 0,
        TotalTestSets: 0,
        TotalPayment: 0
      }
    };
  }
  componentDidMount() {
    const api = new ApiClient();
    api.getDashboard().then(response => {
      this.setState({ data: response.data });
    });
  }

  render() {
    return (
      <div>
        <section className="hero is-medium is-primary is-bold">
          <div className="hero-body">
            <div className="container">
              <h1 className="title">Primary bold title</h1>
              <h2 className="subtitle">Primary bold subtitle</h2>
            </div>
          </div>
        </section>
        {/* <h2
          className="is-size-3-desktop is-size-4 -mobile is-size-4-tablet"
          style={{
            textAlign: "center",

            fontFamily: "roboto"
          }}
        >
          <i className="fas fa-user-shield"></i> Welcome to Rankerstack Admin
          Panel !
        </h2>
        <div
          style={{ marginTop: "1rem" }}
          className="columns is-multiline  is-centered"
        >
          <div
            style={{
              background: "#0082c8",
              minHeight: "200px",

              height: "auto",
              margin: "1rem",
              boxShadow: "0px 0px 8px 1px rgba(46,74,117,1)",
              borderRadius: "2ch"
            }}
            className="column  level-item"
          >
            <h2
              className="is-size-4-desktop is-size-5-mobile"
              style={{ fontFamily: "Roboto", color: "#fff" }}
            >
              <i
                style={{
                  textAlign: "center",
                  marginRight: "2rem",

                  color: "#fff"
                }}
                className="fas fa-users is-size-4-desktop is-size-5-mobile"
              />
              Total Users
            </h2>
            <h3
              className="is-size-2-desktop is-size-5-mobile"
              style={{
                marginTop: "2rem",
                fontFamily: "Roboto",
                textAlign: "center",
                color: "#fff"
              }}
            >
              {this.state.data.TotalUsers}
            </h3>
          </div>
          <div
            style={{
              background: "#0082c8",
              minHeight: "200px",
              height: "auto",
              margin: "1rem",
              boxShadow: "0px 0px 8px 1px rgba(46,74,117,1)",
              borderRadius: "2ch"
            }}
            className="column level-item"
          >
            <h2
              className="is-size-4-desktop is-size-5-mobile"
              style={{ fontFamily: "Roboto", color: "#fff" }}
            >
              <i
                style={{
                  textAlign: "center",
                  marginRight: "2rem",

                  color: "#fff"
                }}
                class="is-size-4-desktop is-size-5-mobile"
              />
              Total Mains Series
            </h2>
            <h3
              className="is-size-2-desktop is-size-5-mobile"
              style={{
                marginTop: "2rem",
                textAlign: "center",

                color: "#fff"
              }}
            >
              {this.state.data.TotalMainsSeries}
            </h3>
          </div>
          <div
            style={{
              background: "#0082c8",
              minHeight: "200px",
              height: "auto",
              margin: "1rem",
              boxShadow: "0px 0px 8px 1px rgba(46,74,117,1)",
              borderRadius: "2ch"
            }}
            className="column level-item"
          >
            <h2
              className="is-size-4-desktop is-size-5-mobile"
              style={{ fontFamily: "Roboto", color: "#fff" }}
            >
              <i
                style={{
                  textAlign: "center",
                  marginRight: "2rem",

                  color: "#fff"
                }}
                class="far fa-paper-plane is-size-4-desktop is-size-5-mobile"
              />
              Total Prelims Series
            </h2>
            <h3
              className="is-size-2-desktop is-size-5-mobile"
              style={{
                marginTop: "2rem",
                textAlign: "center",

                color: "#fff"
              }}
            >
              {this.state.data.TotalPrelimsSeries}
            </h3>
          </div>
          <div
            style={{
              background: "#0082c8",
              minHeight: "200px",
              height: "auto",
              margin: "1rem",
              boxShadow: "0px 0px 8px 1px rgba(46,74,117,1)",
              borderRadius: "2ch"
            }}
            className="column level-item"
          >
            <h2
              className="is-size-4-desktop is-size-5-mobile"
              style={{ fontFamily: "Roboto", color: "#fff" }}
            >
              <i
                style={{
                  textAlign: "center",
                  marginRight: "2rem",

                  color: "#fff"
                }}
                class="fas fa-heart is-size-4-desktop is-size-5-mobile"
              />
              Total Test Sets
            </h2>
            <h3
              className="is-size-2-desktop is-size-5-mobile"
              style={{
                marginTop: "2rem",
                textAlign: "center",

                color: "#fff"
              }}
            >
              {this.state.data.TotalTestSets}
            </h3>
          </div>
        </div>
        <div
          style={{ marginTop: "1rem" }}
          className="columns is-multiline  is-centered"
        >
          <div
            style={{
              background: "#0082c8",
              minHeight: "200px",
              height: "auto",
              margin: "1rem",
              boxShadow: "0px 0px 8px 1px rgba(46,74,117,1)",
              borderRadius: "2ch"
            }}
            className="column level-item"
          >
            <h2
              className="is-size-4-desktop is-size-5-mobile"
              style={{ fontFamily: "Roboto", color: "#fff" }}
            >
              <i
                style={{
                  textAlign: "center",
                  marginRight: "2rem",

                  color: "#fff"
                }}
                class="fas fa-heart is-size-4-desktop is-size-5-mobile"
              />
              Total Daily Mains
            </h2>
            <h3
              className="is-size-2-desktop is-size-5-mobile"
              style={{
                marginTop: "2rem",
                textAlign: "center",

                color: "#fff"
              }}
            >
              {this.state.data.TotalDailyMains}
            </h3>
          </div>
          <div
            style={{
              background: "#0082c8",
              minHeight: "200px",
              height: "auto",
              margin: "1rem",
              boxShadow: "0px 0px 8px 1px rgba(46,74,117,1)",
              borderRadius: "2ch"
            }}
            className="column level-item"
          >
            <h2
              className="is-size-4-desktop is-size-5-mobile"
              style={{ fontFamily: "Roboto", color: "#fff" }}
            >
              <i
                style={{
                  textAlign: "center",
                  marginRight: "2rem",

                  color: "#fff"
                }}
                class="fas fa-heart is-size-4-desktop is-size-5-mobile"
              />
              Total Candidates
            </h2>
            <h3
              className="is-size-2-desktop is-size-5-mobile"
              style={{
                marginTop: "2rem",
                textAlign: "center",

                color: "#fff"
              }}
            >
              {this.state.data.TotalCandidates}
            </h3>
          </div>
          <div
            style={{
              background: "#0082c8",
              minHeight: "200px",
              height: "auto",
              margin: "1rem",
              boxShadow: "0px 0px 8px 1px rgba(46,74,117,1)",
              borderRadius: "2ch"
            }}
            className="column level-item"
          >
            <h2
              className="is-size-4-desktop is-size-5-mobile"
              style={{ fontFamily: "Roboto", color: "#fff" }}
            >
              <i
                style={{
                  textAlign: "center",
                  marginRight: "2rem",

                  color: "#fff"
                }}
                class="fas fa-heart is-size-4-desktop is-size-5-mobile"
              />
              Total Payment
            </h2>
            <h3
              className="is-size-2-desktop is-size-5-mobile"
              style={{
                marginTop: "2rem",
                textAlign: "center",

                color: "#fff"
              }}
            >
              {this.state.data.TotalPayment}
            </h3>
          </div>
          <div
            style={{
              background: "#0082c8",
              minHeight: "200px",
              height: "auto",
              margin: "1rem",
              boxShadow: "0px 0px 8px 1px rgba(46,74,117,1)",
              borderRadius: "2ch"
            }}
            className="column level-item"
          >
            <h2
              className="is-size-4-desktop is-size-5-mobile"
              style={{ fontFamily: "Roboto", color: "#fff" }}
            >
              <i
                style={{
                  textAlign: "center",
                  marginRight: "2rem",

                  color: "#fff"
                }}
                class="fas fa-heart is-size-4-desktop is-size-5-mobile"
              />
              Total Mail Sent
            </h2>
            <h3
              className="is-size-2-desktop is-size-5-mobile"
              style={{
                marginTop: "2rem",
                textAlign: "center",

                color: "#fff"
              }}
            >
              {this.state.data.TotalMailSent}
            </h3>
          </div>
        </div> */}
      </div>
    );
  }
}
