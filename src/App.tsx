import "./App.css";

import * as React from "react";
import { UserInfo } from "react-adal";

import { Web } from "@pnp/sp";
import adalContext, { endpoint } from "./adalConfig";

interface IAppState {
  curUser: Partial<UserInfo>;
  webTitle: string;
}

class App extends React.Component<{}, IAppState> {
  constructor(props: any) {
    super(props);
    this.state = {
      curUser: {},
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
    // web.lists.get().then((item: any) => {
    //   this.setState({
    //     plists: item
    //   });
    //   // console.log(item[0]);
    // });
    // web.lists
    //   .getByTitle("ACWW-1 Core")
    //   .defaultView
    //   // .views.getByTitle("Test August 8")
    //   .fields
    //   .get()
    //   .then((item:any) => {
    //     console.log(item.Items)
    //   });

    const thisUser: UserInfo = adalContext.GetUser();
    this.setState({ curUser: thisUser });
  }

  public onLogOut() {
    adalContext.LogOut();
  }

  public render() {
    // const plists = this.state.plists.map(e => {
    //   return (
    //     <div key={e.Title}>
    //       <b>List Name: </b> {e.Title}
    //     </div>
    //   );
    // });
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to {this.state.webTitle}</h1>
          <span style={{ marginRight: "5px", color: "white" }}>
            {this.state.curUser.userName} ({this.state.curUser.profile.name})
          </span>
          <button onClick={this.onLogOut}>Log out</button>
        </header>
        {/* {plists} */}
      </div>
    );
  }
}

export default App;
