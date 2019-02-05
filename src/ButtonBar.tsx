import * as React from "react";

import styled from "styled-components";

const Wrapper = styled.div`
  margin-top: 10px;
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const StyledButton = styled.button`
    min-width: 30%;
    padding: 10px 20px;
    border-radius: 6px;
    border: ${props =>
      props.type === "Danger"
        ? "2px solid red"
        : props.type === "Success"
        ? "2px solid green"
        : "2px solid black"}
    color: ${props =>
      props.type === "Danger"
        ? "red"
        : props.type === "Success"
        ? "green"
        : "black"}
    background: white;
    // font-weight: bold;
    font-size: 18px;
    cursor: pointer;
    -moz-box-shadow: 1px 1px 6px #000000;
    -webkit-box-shadow: 1px 1px 6px #000000;
    box-shadow: 1px 1px 6px #000000;

    :hover {
        background: ${props =>
          props.type === "Danger"
            ? "red"
            : props.type === "Success"
            ? "green"
            : "black"}
        color: white;
    }
`;

const DisabledButton = styled.button`
    min-width: 30%;
    padding: 10px 20px;
    border-radius: 6px;
    border: "2px solid lightgrey"}
    color: : "lightgrey"}
    background: white;
    font-size: 18px;
    cursor: no-drop;
    -moz-box-shadow: 1px 1px 6px #000000;
    -webkit-box-shadow: 1px 1px 6px #000000;
    box-shadow: 1px 1px 6px #000000;
`;

interface IAppProps {
  actionReset: any;
  actionSubmit: any;
  submitEnabled: boolean;
}

class ButtonBar extends React.Component<IAppProps, {}> {
  constructor(props: any) {
    super(props);
  }

  public render() {
    return (
      <Wrapper>
        <StyledButton onClick={this.props.actionReset} type={"Danger"}>Reset</StyledButton>
        {!this.props.submitEnabled ? (
          <DisabledButton>Save to Database</DisabledButton>
        ) : (
          <StyledButton onClick={this.props.actionSubmit} type={"Success"}>
            Save to Database
          </StyledButton>
        )}
      </Wrapper>
    );
  }
}

export default ButtonBar;
