import * as React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import styled from "styled-components";

import Header from "./Header";
import Home from "./Home";

import { UserInfo } from "react-adal";

import adalContext from "./adalConfig";


const Wrapper = styled.section`
  padding: 0.5em;
  background: papayawhip;
  height: 97vh;
`;

const About = () => <h2>About</h2>;
const Users = () => <h2>Users</h2>;

interface IAppState {
  curUser: Partial<UserInfo>;
  loading: boolean
  webTitle: string;
}
class App2 extends React.Component<{}, IAppState> {
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
          <Header user={this.state.curUser}/>
          <Route path="/" exact={true} component={Home} />
          <Route path="/about/" component={About} />
          <Route path="/users/" component={Users} />
        </Wrapper>
      </Router>
    );
  }
}

export default App2;
