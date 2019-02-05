import * as React from "react";

import styled from "styled-components";

import { Link } from "react-router-dom";

import { FaArrowRight } from "react-icons/fa"
// import { FaCheck } from "react-icons/fa";

import { UserInfo } from "react-adal";

import adalContext from "./adalConfig";

import { Web } from "@pnp/sp";
import { endpoint } from "./adalConfig";

import HeaderBar from "./HeaderBar"

const Parent = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 5px;
`;

const SearchChild = styled.div`
  width: 100%;
  background: white;
  margin: 10px 0;
  padding: 10px 20px;
  border-radius: 6px;
  -moz-box-shadow: 1px 1px 6px #000000;
  -webkit-box-shadow: 1px 1px 6px #000000;
  box-shadow: 1px 1px 6px #000000;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const BoxChild = styled.div`
  //   align-self: flex-end;
  width: 140%;
  background: white;
  margin-bottom: 10px;
  padding: 10px 20px;
  border-radius: 6px;
  -moz-box-shadow: 1px 1px 6px #000000;
  -webkit-box-shadow: 1px 1px 6px #000000;
  box-shadow: 1px 1px 6px #000000;
  //   border: 1px solid green;
`;

const SearchBox = styled.input`
  height: 24px;
  font-size: 20px;
  width: 100%;
  border-radius: 4px;
`;

// const Button = styled.button`
//   padding: 5px 18px;
//   background: white;
//   color: green
//   border: 2px solid green;
//   font-size: 12px;
//   border-radius: 5px;
//   cursor: pointer;

//   :hover {
//       background: green;
//       color: white;
//   }
// `;

const BoxTitle = styled(Link)`
  font-size: 30px;
  padding: 5px;
  display: flex;
  justify-content: space-between;
  text-decoration: none;
  color: black;

  :hover {
      text-decoration: underline;
  }
`;

const Listings = (props: any) => {
  const dataBoxes = props.plants.map((e: any) => (
    <BoxChild key={e.id}>
      <BoxTitle to={props.url + 'list/' + e.id}>
        <div>{e.name}</div>
        <FaArrowRight/>
        {/* {e.valid && <FaCheck style={{ color: "green" }} />} */}
      </BoxTitle>
    </BoxChild>
  ));
  return dataBoxes;
};

interface IAppState {
  curUser: any;
  filteredPlants: any[];
  loading: boolean;
  plants: any[];
}

interface IAppProps {
    match: any;
}

class Home extends React.Component<IAppProps, IAppState> {
  constructor(props: any) {
    super(props);
    this.state = {
      curUser: {},
      filteredPlants: [],
      loading: true,
      plants: []
    };
    this.handleSearch = this.handleSearch.bind(this);
  }

  public componentWillMount() {
    const web = new Web(endpoint + "/operations");
    web.lists.get().then((item: any) => {
      if (item.length > 0) {this.setState({ loading: false })}
      item.map((e: any) => {
        const objectCopy = Object.assign({}, this.state);
        objectCopy.plants.push({ id: e.Id, name: e.Title });
        objectCopy.filteredPlants.push({ id: e.Id, name: e.Title });
        this.setState(objectCopy);
      });
    });
    const thisUser: UserInfo = adalContext.GetUser();
    this.setState({ curUser: thisUser });
  }

  public onLogOut() {
    adalContext.LogOut();
  }

  public handleSearch(event: any) {
    this.setState({
      filteredPlants: this.state.plants.filter(e =>
        e.name.toLowerCase().includes(event.target.value.toLowerCase())
      )
    });
  }

  public render() {
    return (
      <Parent>
        {/* <SiteTitle>Operations Data Collection</SiteTitle>
        <AuthenticatedUsername>
          {this.state.curUser.userName}{" "}
          <SmallButton onClick={this.onLogOut}>logout</SmallButton>
        </AuthenticatedUsername> */}
        <HeaderBar home={true} title={"Operations Data Collection"} user={this.state.curUser.userName} logoutAction={this.onLogOut}/>
        <SearchChild>
          <SearchBox onChange={this.handleSearch} type="text" placeholder="Search..." />
        </SearchChild>
        {this.state.loading ? <h1>Loading...</h1> : <Listings url={this.props.match.url} plants={this.state.filteredPlants} />}
        
      </Parent>
    );
  }
}

export default Home;
