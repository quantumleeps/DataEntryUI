import "./App.css";

import * as React from "react";
import { UserInfo } from 'react-adal';
// import logo from "./logo.svg";

import { Web } from "@pnp/sp";
import adalContext, { endpoint } from "./adalConfig";


interface IAppState {
  curUser: Partial<UserInfo>;
  lists: any[];
  webTitle: string;
}


class App extends React.Component<{}, IAppState> {
  constructor(props: any) {
    super(props);
    this.state = { 
      curUser: {},
      lists: [],
      webTitle: ""
     };
    this.onLogOut = this.onLogOut.bind(this);
  }

  public componentWillMount() {
    const web = new Web(endpoint + "/operations");
    web
      .select("Title")
      .get()
      .then(w => {
        this.setState({
          webTitle: w.Title
        });
      });
    web.lists
      .get()
      .then((item: any) => {
        this.setState({
          lists: item
        })
        // console.log(item[0]);
      });
    web.lists
      .getByTitle('ACWW-1 Core')
      .fields
      .get()
      .then(f => {
        console.log(f)
      })
    const thisUser:UserInfo = adalContext.GetUser()
    console.log(thisUser)
    this.setState( {curUser: thisUser} )
  }

  public onLogOut() {
    adalContext.LogOut();
  }

  public render() {
    const lists = this.state.lists.map(e => {
      return <div key={e.Title}><b>List Name: </b> {e.Title}</div>
    })
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to {this.state.webTitle}</h1>
          <span style={{ marginRight: "5px", color: 'white' }}>{this.state.curUser.userName}</span>
          <button onClick={this.onLogOut}>Log out</button>
        </header>
        {lists}
      </div>
    );
  }
}

export default App;
