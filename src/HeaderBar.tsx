import * as React from "react";

import styled from "styled-components";

import { Link } from "react-router-dom";

import { FaArrowLeft } from "react-icons/fa";

// Flexbox wrapper for the header bar
const HeaderWrapper = styled.div`
  border-radius: 6px;
  padding: 10px 10px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  background: white;
  -moz-box-shadow: 1px 1px 6px #000000;
  -webkit-box-shadow: 1px 1px 6px #000000;
  box-shadow: 1px 1px 6px #000000;
`;

// Left side of wrapper. Also a flex to center the
// content vertically
const TitleLink = styled(Link)`
  display: flex;
  align-items: center;
  padding: 5px 10px;
  font-size: 28px;
  text-decoration: none;
  color: black;

  :hover {
    text-decoration: underline;
  }
`;

// Right side of the wrapper. Also a flex to center the
// content vertically
const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  color: black;
  border-left: 1px dotted black;
  padding-left: 20px;
`;

// Arrow on the left side of the
// title. This is only displayed when 
// props.home = false
const StyledArrow = styled(FaArrowLeft)`
  font-size: 25px;
  margin-right: 8px;
`;

// Button used to log out of Azure AD
const SmallButton = styled.button`
  margin-left: 5px;
  margin-top: 5px;
  padding: 2px 6px;
  background: white;
  color: black
  border: 1px solid black;
  font-size: 12px;
  border-radius: 3px;
  cursor: pointer;

  :hover {
      background: black;
      color: white;
  }
`;

// Container props
interface IAppProps {
    title: string;
    user: string;
    logoutAction: any;
    home: boolean;
}

class HeaderBar extends React.Component<IAppProps, {}> {
  constructor(props: any) {
    super(props);
  }

  public render() {
    return (
      <HeaderWrapper>
        <TitleLink to="/">
          {!this.props.home && <StyledArrow />}
          {this.props.title}
        </TitleLink>
        <UserInfo>
          <div>{this.props.user}</div>
          <SmallButton onClick={this.props.logoutAction}>Logout</SmallButton>
        </UserInfo>
      </HeaderWrapper>
    );
  }
}

export default HeaderBar;
