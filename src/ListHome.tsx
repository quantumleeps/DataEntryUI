import * as React from "react";
import { UserInfo } from "react-adal";
import { withRouter } from "react-router-dom";
import Alert from "react-s-alert";
import styled from "styled-components";

import { ItemAddResult, Web } from "@pnp/sp";

import adalContext, { endpoint } from "./adalConfig";
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

const opsWeb = new Web(endpoint + "/operations");

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
    this.handleButtonClickem = this.handleButtonClickem.bind(this);
  }

  //    this performs the first time a page loads or if
  //    a new view is selected. When a new view is selected
  //    the this.state.datapoints needs to be cleared out
  // 1. get the default view's view Id ( getDefaultId() )
  // 2. get the default view's internal fieldnames list ( getFieldList() )
  // 3. for each item in the list, create an object and add ( populateDatapoints() )
  //    it to the this.state.datapoints array

  public getDefaultView(web: any, listId: string) {
    return web.lists.getById(listId).defaultView.get();
  }

  public getViewField(web: any, listId: string, viewId: string) {
    return web.lists
      .getById(listId)
      .views.getById(viewId)
      .fields.get();
  }

  public getField(web: any, listId: string, fieldInternalName: any) {
    return web.lists
      .getById(listId)
      .fields.getByInternalNameOrTitle(fieldInternalName)
      .get();
  }

  public loadDatapointsToState(web: any, listId: string, viewId: string) {
    this.getViewField(web, listId, viewId).then((viewField: any) => {
      viewField.Items.forEach((fieldInternalName: any, index: number) => {
        this.getField(
          opsWeb,
          this.props.match.params.id,
          fieldInternalName
        ).then((field: any) => {
          const objectCopy = Object.assign({}, this.state);
          const pushData = {
            group: field.Description.length
              ? JSON.parse(field.Description).group
              : null,
            id: field.Id,
            internalName: field.EntityPropertyName,
            max: field.MaximumValue,
            min: field.MinimumValue,
            name: field.Title,
            order: index,
            units: field.Description.length
              ? JSON.parse(field.Description).units
              : null,
            validityState: 0,
            value: ""
          };
          objectCopy.datapoints.push(pushData);
          this.setState(objectCopy);
        });
      });
    });
  }

  public componentWillMount() {
    this.getDefaultView(opsWeb, this.props.match.params.id).then(
      (view: any) => {
        this.loadDatapointsToState(opsWeb, this.props.match.params.id, view.Id);
      }
    );

    opsWeb.lists
      .getById(this.props.match.params.id)
      .get()
      .then((list: any) => this.setState({ curTitle: list.Title }));
    const thisUser: UserInfo = adalContext.GetUser();
    this.setState({ curUser: thisUser });

    // opsWeb.lists.getById(this.props.match.params.id).views.get().then((views:any[]) => {
    //   console.log(views)
    //   // "5bf68c7a-b494-4487-b97f-74335c6ed8ac"
    // })
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
    let numValid = 0;
    let numInvalid = 0;
    this.state.datapoints.forEach((datapoint: any) => {
      datapoint.validityState === 2 ? numInvalid++ : (numInvalid = numInvalid);
      datapoint.validityState === 1 ? numValid++ : (numValid = numValid);
    });
    numInvalid > 0
      ? this.setState({ formIsValid: false })
      : this.setState({ formIsValid: true });
    numValid < 1
      ? this.setState({ formIsValid: false })
      : this.setState({ formIsValid: true });
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

  public newView(viewId:string) {
    this.setState({ datapoints: [] })
    this.loadDatapointsToState(opsWeb, this.props.match.params.id, viewId)
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
    // add an item to the list if there is an
    // internet connection, otherwise alert the user
    if (navigator.onLine) {
      opsWeb.lists
        .getById(this.props.match.params.id)
        .items.add(this.createPayload(this.state.datapoints))
        .then((iar: ItemAddResult) => {
          console.log(iar);
        });
      this.props.history.push("/");
    } else {
      Alert.warning(
        "You don't have an internet connection. Please go get one.",
        { position: "top" }
      );
    }
  }

  public refreshPage() {
    location.reload();
  }

  public handleButtonClickem() {
    this.newView("5bf68c7a-b494-4487-b97f-74335c6ed8ac")
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
        {/* <button onClick={this.handleButtonClickem}>Click me</button> */}
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
        {!this.state.loading && (
          <ButtonBar
            submitEnabled={this.state.formIsValid}
            actionReset={this.refreshPage}
            actionSubmit={this.submitRecord}
          />
        )}
      </Parent>
    );
  }
}

export default withRouter(ListHome);
