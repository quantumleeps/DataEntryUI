import * as React from "react";

import styled from "styled-components";

import { UserInfo } from "react-adal";

import adalContext from "./adalConfig";

import { Web } from "@pnp/sp";
import { endpoint } from "./adalConfig";

import ButtonBar from "./ButtonBar";
import DataInputBox from "./DataInputBox";
import HeaderBar from "./HeaderBar";

const Parent = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 5px;
`;

const BoxChild = styled.div`
  //   align-self: flex-end;
  width: 140%;
  background: white;
  margin-top: 10px;
  padding: 10px 20px;
  border-radius: 6px;
  -moz-box-shadow: 1px 1px 6px #000000;
  -webkit-box-shadow: 1px 1px 6px #000000;
  box-shadow: 1px 1px 6px #000000;
  border: ${props =>
    props.hasValue
      ? !props.invalid && props.valid
        ? "3px solid green"
        : "3px solid red"
      : "none"};
`;

const BoxTitle = styled.div`
  font-size: 30px;
  padding: 5px;
  display: flex;
  justify-content: space-between;
`;

const Listings = (props: any) => {
  const dataBoxes = props.datapoints.map((e: any, i: any) => (
    <BoxChild
      key={e.id}
      valid={e.valid}
      invalid={e.invalid}
      hasValue={e.value.length > 0}
    >
      <BoxTitle>
        <div>{e.name}</div>
      </BoxTitle>
      <DataInputBox
        name={e.id}
        invalid={e.invalid}
        action={props.action}
        units={e.units}
        valid={e.valid}
        value={e.value}
      />
      <div>
        {e.min > -1.7e307 && (
          <span>
            <b>min: </b> {e.min}
          </span>
        )}
        {e.min > -1.7e307 && e.max < 1.7e307 && <span>, </span>}
        {e.max < 1.7e307 && (
          <span>
            <b>max: </b> {e.max}
          </span>
        )}
      </div>
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
  loading: boolean;
  searchFilter: "";
}

class ListHome extends React.Component<IAppProps, IAppState> {
  constructor(props: any) {
    super(props);
    this.state = {
      curTitle: "",
      curUser: {},
      datapoints: [],
      loading: true,
      searchFilter: ""
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleDataInput = this.handleDataInput.bind(this);
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
                  invalid: false,
                  max: thing.MaximumValue,
                  min: thing.MinimumValue,
                  name: thing.Title,
                  order: index,
                  units: thing.Description.length
                    ? JSON.parse(thing.Description).units
                    : null,
                  valid: false,
                  value: ""
                };
                objectCopy.datapoints.push(pushData);
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

  public handleClick() {
    console.log("it got clicked");
  }

  public handleSearch(event: any) {
    this.setState({ searchFilter: event.target.value });
  }

  public checkValid(value: number, min: number, max: number) {
    if (value >= min) {
      if (value <= max) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  public handleDataInput(event: any) {
    this.state.datapoints.forEach((item, index) => {
      if (item.id === event.target.name) {
        const datapoints = [...this.state.datapoints];
        datapoints[index] = {
          ...datapoints[index],
          valid: this.checkValid(event.target.value, item.min, item.max)
        };
        datapoints[index] = {
          ...datapoints[index],
          invalid: !this.checkValid(event.target.value, item.min, item.max)
        };
        datapoints[index] = { ...datapoints[index], value: event.target.value };
        this.setState({ datapoints });
      }
    });
  }

  public render() {
    return (
      <Parent>
        <HeaderBar home={false} title={this.state.curTitle} user={this.state.curUser.userName} logoutAction={this.onLogOut}/>
        {this.state.loading ? (
          <h1>Loading...</h1>
        ) : (
          <Listings
            action={this.handleDataInput}
            datapoints={this.state.datapoints
              .filter(e =>
                e.name
                  .toLowerCase()
                  .includes(this.state.searchFilter.toLowerCase())
              )
              .sort((a: any, b: any) => a.order - b.order)}
          />
        )}
        {!this.state.loading && <ButtonBar />}
      </Parent>
    );
  }
}

export default ListHome;
