import * as React from "react";
import styled from "styled-components";

import { Link } from "react-router-dom";

import { Web } from "@pnp/sp";
import { endpoint } from "./adalConfig";

const DataBox = styled.div`
  background-color: white;
  color: black;
  padding: 0.75em;
  margin: 0.5em 0em;
  border-radius: 0.2em;
  -webkit-box-shadow: 1px 1px 1px 1px #ccc; /* Safari 3-4, iOS 4.0.2 - 4.2, Android 2.3+ */
  -moz-box-shadow: 1px 1px 1px 1px #ccc; /* Firefox 3.5 - 3.6 */
  box-shadow: 1px 1px 1px 1px #ccc; /* Opera 10.5, IE 9, Firefox 4+, Chrome 6+, iOS 5 */
`;

const SearchBox = styled.input`
  margin-top: 0.2em;
  padding: 2px;
  font-size: 1.1em;
  line-height: 1.7em;
  border-radius: 0.2em;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: black;
  :hover {
    text-decoration: underline;
  }
`;

const Listings = (props: any) => {
  const dataBoxes = props.plants.map((e: any) => (
    <StyledLink key={e.name} to={e.url}>
      <DataBox>
        {e.name}
        {/* <span style={{ fontSize: "1em", float: "right" }}>></span> */}
      </DataBox>
    </StyledLink>
  ));
  return <span>{dataBoxes}</span>;
};

interface IAppState {
  fields: any[];
  filteredFields: any[];
  listTitle: string;
  loading: boolean;
  webTitle: string;
}

interface IAppProps {
    match: any;
}

class ListHome extends React.Component<IAppProps, IAppState> {
  constructor(props: any) {
    super(props);
    this.state = {
      fields: [],
      filteredFields: [],
      listTitle: "",
      loading: true,
      webTitle: ""
    };
    this.handleSearch = this.handleSearch.bind(this);
  }

  public componentWillMount() {
    const web = new Web(endpoint + "/operations");
    web.lists
      .getById(this.props.match.params.id)
      .defaultView // .views.getByTitle("Test August 8")
      .fields.get()
      .then((item: any) => {
        // console.log(item.Items);
        item.Items.forEach(
            (field:any) => {
                web.lists.getById(this.props.match.params.id).fields.getByInternalNameOrTitle(field).get().then((thing:any) => {
                    const objectCopy = Object.assign({}, this.state)
                    objectCopy.fields.push({ id: thing.Id, name: thing.Title, url: "/test"} )
                    objectCopy.filteredFields.push({ id: thing.Id, name: thing.Title, url: "/test"} )
                    this.setState(objectCopy)
                    console.log(this.state)
                })
            }
        )
      });
      web.lists
      .getById(this.props.match.params.id).get().then((list:any) => 
        this.setState({listTitle: list.Title})
      )
  }

  public componentDidMount() {
    this.setState({ loading: false });
  }
  public handleSearch(event: any) {
    this.setState({
      filteredFields: this.state.fields.filter(
        e => e.name.toLowerCase().includes(event.target.value.toLowerCase())
        //   ||
        //   e.country.toLowerCase().includes(event.target.value.toLowerCase())
      )
    });
  }

  public render() {
    return (
      <div>
        <SearchBox
          type="text"
          placeholder=" Filter fields"
          onChange={this.handleSearch}
        /><span style={{ padding: "8px", fontSize: "2em", float: "right" }}>{this.state.listTitle}</span>
        {this.state.fields.length < 1 ? (
          <h3>Field list is loading...</h3>
        ) : (
          <Listings plants={this.state.filteredFields} />
        )}
      </div>
    );
  }
}

export default ListHome;
