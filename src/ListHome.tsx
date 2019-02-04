import * as React from "react";

import styled from "styled-components";

// import { FaCheck } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";

import { UserInfo } from "react-adal";

import adalContext from "./adalConfig";

import { Web } from "@pnp/sp";
import { endpoint } from "./adalConfig";

import { Link } from "react-router-dom";

import DataInputBox from "./DataInputBox";

const Parent = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 5px;
`;

const Child = styled.div`
  background: white;
  padding: 10px 20px;
  flex-grow: 1;
  -moz-box-shadow: 1px 1px 6px #000000;
  -webkit-box-shadow: 1px 1px 6px #000000;
  box-shadow: 1px 1px 6px #000000;
`;

const SiteTitle = styled(Child)`
  border-radius: 6px 0 0 6px;
  text-align: left;
  font-size: 26px;
  display: flex;
  align-items: center;

  @media (max-width: 640px) {
    border-radius: 6px 6px 0 0;
  }
`;

const AuthenticatedUsername = styled(Child)`
  border-radius: 0 6px 6px 0;
  text-align: right;
  font-weight: bold;

  @media (max-width: 640px) {
    border-radius: 0 0 6px 6px;
    text-align: left;
  }
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
  border: ${props => props.valid ? "2px solid green" : "none"}
`;

const SearchBox = styled.input`
  height: 24px;
  font-size: 20px;
  width: 80%;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 5px 18px;
  background: white;
  color: green
  border: 2px solid green;
  font-size: 12px;
  border-radius: 5px;
  cursor: pointer;

  :hover {
      background: green;
      color: white;
  }
`;

const SmallButton = styled.button`
  padding: 2px 6px;
  background: white;
  color: black
  border: 1px solid black;
  font-size: 9px;
  border-radius: 3px;
  cursor: pointer;

  :hover {
      background: black;
      color: white;
  }
`;

const BoxTitle = styled.div`
  font-size: 30px;
  padding: 5px;
  display: flex;
  justify-content: space-between;
`;

// const BoxInput = styled.input`
//   height: 53px;
//   font-size: 45px;
//   width: 100%;
//   border: 2px dotted black;
//   border-radius: 5px;

//   :focus {
//     border: 2px solid blue;
//     outline: none;
//     border-radius: 5px;
//   }
// `;

const TitleLink = styled(Link)`
  text-decoration: none;
  color: black;

  :hover {
    text-decoration: underline;
  }
`;

const Listings = (props: any) => {
  const dataBoxes = props.datapoints.map((e: any) => (
    <BoxChild key={e.id} valid={e.valid}>
      <BoxTitle>
        <div>{e.name}</div>
        {/* {e.valid && <FaCheck style={{ color: "green" }} />} */}
      </BoxTitle>
      <DataInputBox units={e.units} valid={e.valid} />
    </BoxChild>
  ));
  return dataBoxes;
};

interface IAppProps {
  match: any;
}

interface IAppState {
  curTitle: string;
  curUser: any;
  datapoints: any[];
  filteredDatapoints: any[];
  loading: boolean;
}

class ListHome extends React.Component<IAppProps, IAppState> {
  constructor(props: any) {
    super(props);
    this.state = {
      curTitle: "",
      curUser: {},
      datapoints: [],
      filteredDatapoints: [],
      loading: true
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  public componentWillMount() {
    const web = new Web(endpoint + "/operations");
    web.lists
      .getById(this.props.match.params.id)
      .defaultView // .views.getByTitle("Test August 8")
      .fields.get()
      .then((item: any) => {
        // console.log(item)
        if (item.length > 0) {
          this.setState({ loading: false });
        }
        // console.log(item.Items);
        item.Items.forEach((field: any, index: number) => {
          web.lists
            .getById(this.props.match.params.id)
            .fields.getByInternalNameOrTitle(field)
            .get()
            .then((thing: any) => {
              if (thing.Title !== "datetime") {
                const objectCopy = Object.assign({}, this.state);
                const pushData = {
                  id: thing.Id,
                  max: thing.MaximumValue,
                  min: thing.MinimumValue,
                  name: thing.Title,
                  order: index,
                  units: thing.Description.length
                    ? JSON.parse(thing.Description).units
                    : null,
                  valid: false
                }
                objectCopy.datapoints.push(pushData);
                objectCopy.filteredDatapoints.push(pushData);
                this.setState(objectCopy);
              }
            });
        });
      });
    web.lists
      .getById(this.props.match.params.id)
      .get()
      .then((list: any) => this.setState({ curTitle: list.Title }));
    const thisUser: UserInfo = adalContext.GetUser();
    this.setState({ curUser: thisUser });
  }

  public componentDidMount() {
    this.setState({ loading: false });
  }

  public onLogOut() {
    adalContext.LogOut();
  }

  // public isValid(value:number, min:number, max:number) {
  //   value > min && value < max
  //   ? true
  //   : false
  // }

  public handleClick() {
    console.log("it got clicked");
  }

  public handleSearch(event: any) {
    this.setState({
      filteredDatapoints: this.state.datapoints.filter(e =>
        e.name.toLowerCase().includes(event.target.value.toLowerCase())
      )
    });
    console.log(this.state);
  }

  public render() {
    return (
      <Parent>
        <SiteTitle>
          <TitleLink to="/">
            <FaArrowLeft style={{ color: "black", marginRight: "5px" }} />
            {this.state.curTitle}
          </TitleLink>
        </SiteTitle>
        <AuthenticatedUsername>
          {this.state.curUser.userName}{" "}
          <SmallButton onClick={this.onLogOut}>logout</SmallButton>
        </AuthenticatedUsername>
        <SearchChild>
          <SearchBox
            onChange={this.handleSearch}
            type="text"
            placeholder="Search..."
          />
          <Button onClick={this.handleClick}>Save</Button>
        </SearchChild>
        {this.state.loading ? (
          <h1>Loading...</h1>
        ) : (
          <Listings
            datapoints={this.state.filteredDatapoints.sort(
              (a: any, b: any) => a.order - b.order
            )}
          />
        )}
      </Parent>
    );
  }
}

export default ListHome;
