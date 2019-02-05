import * as React from "react";

import styled from "styled-components";

import { UserInfo } from "react-adal";

import adalContext from "./adalConfig";

import { ItemAddResult } from "@pnp/sp";

import { Web } from "@pnp/sp";
import { endpoint } from "./adalConfig";

import ButtonBar from "./ButtonBar";
import DataInputBox from "./DataInputBox";
import HeaderBar from "./HeaderBar";

import { withRouter } from "react-router-dom";

import Alert from "react-s-alert"

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
    props.validityState === 1
    ? "3px solid green"
    : props.validityState === 2
      ? "3px solid red"
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
      hasValue={e.value.length > 0}
      validityState={e.validityState}
    >
      <BoxTitle>
        <div>{e.name}</div>
      </BoxTitle>
      <DataInputBox
        name={e.id}
        action={props.action}
        units={e.units}
        validityState={e.validityState}
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
  history: any;
  match: any;
}

interface IAppState {
  curTitle: string;
  curUser: any;
  datapoints: any[];
  formIsValid: boolean;
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
      formIsValid: false,
      loading: true,
      searchFilter: ""
    };

    this.handleSearch = this.handleSearch.bind(this);
    this.handleDataInput = this.handleDataInput.bind(this);
    this.submitRecord = this.submitRecord.bind(this);
    this.refreshPage = this.refreshPage.bind(this);
  }

  public componentWillMount() {
    const web = new Web(endpoint + "/operations");
    web.lists
      .getById(this.props.match.params.id)
      .defaultView
      .fields.get()
      .then((item: any) => {
        if (item.length > 0) {
          this.setState({ loading: false });
        }
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
                  internalName: thing.EntityPropertyName,
                  max: thing.MaximumValue,
                  min: thing.MinimumValue,
                  name: thing.Title,
                  order: index,
                  units: thing.Description.length
                    ? JSON.parse(thing.Description).units
                    : null,
                  validityState: 0,
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

  public updateFormValidity() {
    let numValid = 0
    let numInvalid = 0
    this.state.datapoints.forEach((datapoint:any) => {
      datapoint.validityState === 2 
      ? numInvalid++
      : numInvalid = numInvalid
      datapoint.validityState === 1
      ? numValid++
      : numValid = numValid
    })
    numInvalid > 0 ? this.setState({ formIsValid: false }) : this.setState({ formIsValid: true })
    numValid < 1 ? this.setState({ formIsValid: false }) : this.setState({ formIsValid: true })
  }

  public handleDataInput(event: any) {
    this.state.datapoints.forEach((item, index) => {
      if (item.id === event.target.name) {
        const datapoints = [...this.state.datapoints];
        datapoints[index] = {
          ...datapoints[index],
          validityState:
            event.target.value.length > 0
              ? this.checkValid(event.target.value, item.min, item.max)
                ? 1
                : 2
              : 0
        };
        datapoints[index] = { ...datapoints[index], value: event.target.value };
        this.setState({ datapoints }, this.updateFormValidity);
      }
    });
  }

  public createPayload(datapoints: any[]) {
    const arrayToObject = (array: any[], keyField: any) =>
      array.reduce((obj, item) => {
        obj[item[keyField]] = parseFloat(item.value);
        return obj;
      }, {});
    return arrayToObject(datapoints, "internalName");
  }

  public submitRecord() {
    const web = new Web(endpoint + "/operations");
    // add an item to the list if there is an
    // internet connection, otherwise alert the user
    if (navigator.onLine) {
      web.lists
      .getById(this.props.match.params.id)
      .items.add(this.createPayload(this.state.datapoints))
      .then((iar: ItemAddResult) => {
        console.log(iar);
      });
    this.props.history.push("/");
    } else {
      Alert.warning("You don't have an internet connection. Please go get one.", { position: "top" })
    }
  }

  public refreshPage() {
    location.reload()
  }

  public render() {
    return (
      <Parent>
        <HeaderBar
          home={false}
          title={this.state.curTitle}
          user={this.state.curUser.userName}
          logoutAction={this.onLogOut}
        />
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
        {!this.state.loading && <ButtonBar submitEnabled={this.state.formIsValid} actionReset={this.refreshPage} actionSubmit={this.submitRecord} />}
      </Parent>
    );
  }
}

export default withRouter(ListHome);
