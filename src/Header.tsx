import * as React from "react";
import styled from "styled-components";

import { Link } from "react-router-dom";

const HeaderWrapper = styled.div`
  background-color: black;
  color: white;
  padding: 0.75em;
  margin: 0px;
  border-radius: 0.2em;
`;

const StyledHeader = styled.span`
  font-size: 1.2em;
  padding: 0em;
  margin: 0em;
  text-decoration: none;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: white;
  :hover {
    text-decoration: underline;
  }
`;

const Header = (props: any) => (
  <HeaderWrapper>
    <StyledHeader>
      <StyledLink to="/">Operations Data Collection</StyledLink>
    </StyledHeader>
    {props.user.userName.length > 0 ? (
      <span style={{ float:"right", marginRight: "5px", color: "white" }}>
        {props.user.userName} ({props.user.profile.name})
      </span>
    ) : (
      "not logged in"
    )}
  </HeaderWrapper>
);

export default Header;
