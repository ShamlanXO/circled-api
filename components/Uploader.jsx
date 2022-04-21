import React from "react";
import { WrapperBox, ApiClient, ViewHelpers, StyledButton } from "admin-bro";

class Uploader extends React.Component {
  constructor(props) {
    super(props);
    this.h = new ViewHelpers();
    this.state = {
      data: {
        ToolsToken: null
      }
    };
  }
  componentDidMount() {
    const api = new ApiClient();
    api.getPage({ pageName: "customPage" }).then(response => {
      this.setState({ data: response.data });
    });
  }
  render() {
    return (
      <WrapperBox>
        <WrapperBox border>
          <h1>Welcome, admin</h1>
          <div>
            <p>This is one way portal to all the admin tools you'll need...</p>

            <p>
              <StyledButton
                onClick={() => {
                  window.open(
                    `https://rankerstack.com/file-uploader?token=${this.state.data.ToolsToken}`
                  );
                }}
              >
                Click me to access File Uploader
              </StyledButton>
            </p>
          </div>
        </WrapperBox>
      </WrapperBox>
    );
  }
}
export default Uploader;
