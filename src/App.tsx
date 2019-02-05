import * as React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import styled from "styled-components";

// import Header from "./Header";
import Home from "./Home";
import ListHome from "./ListHome"

import { UserInfo } from "react-adal";

import adalContext from "./adalConfig";

import Alert from 'react-s-alert';

import './react-s-alert-default.css';


const Wrapper = styled.section`
  padding: 0.5em;
  background: #b6bbc4;
  min-height: 100vh;
`;

interface IAppState {
  curUser: Partial<UserInfo>;
  loading: boolean
  webTitle: string;
}
class App extends React.Component<{}, IAppState> {
  constructor(props: any) {
    super(props);
    this.state = {
      curUser: {},
      loading: true,
      webTitle: ""
    };
    this.onLogOut = this.onLogOut.bind(this);
  }
  public componentWillMount() {
    const thisUser: UserInfo = adalContext.GetUser();
    this.setState({ curUser: thisUser, loading: false });
  }

  public onLogOut() {
    adalContext.LogOut();
  }

  public render() {
    return (
      <Router>
        <Wrapper>

          {/* <Header user={this.state.curUser}/> */}
          <Route path="/" exact={true} component={Home} />
          {/* <Route path="/" exact={true} component={PlantHome} /> */}
          <Route path="/list/:id" exact={true} component={ListHome} />
          <Alert stack={{limit: 3}} />
        </Wrapper>
      </Router>
    );
  }
}

export default App;
