import * as React from "react";
import styled from "styled-components";

import { Link } from "react-router-dom"

const PLANTS = [
  {
    country: "The Bahamas",
    id: 1,
    name: "Blue Hills Train 1",
    url: "/lists/bh1-core-1"
  },
  {
    country: "The Bahamas",
    id: 2,
    name: "Blue Hills Train 2",
    url: "/lists/bh1-core-2"
  },
  {
    country: "The Bahamas",
    id: 3,
    name: "Blue Hills Train 3",
    url: "/lists/bh1-core-3"
  },
  {
    country: "Grand Cayman",
    id: 4,
    name: "GHB2",
    url: "/lists/bh1-core-1"
  },
  {
    country: "Grand Cayman",
    id: 5,
    name: "GHB3",
    url: "/lists/bh1-core-2"
  },
  {
    country: "Grand Cayman",
    id: 6,
    name: "NSWW",
    url: "/lists/bh1-core-3"
  }
];

const PlantBox = styled.div`
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
  margin: .2em;
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
  const plantBoxes = props.plants.map((e: any) => (
    <StyledLink key={e.id} to={e.url}>
      <PlantBox>
        {e.name}
        <span style={{ fontSize: "1em", float: "right" }}>></span>
      </PlantBox>
    </StyledLink>
  ));
  return <span>{plantBoxes}</span>;
};

interface IAppState {
  filteredPlants: any[];
  plants: any[];
}

class Home extends React.Component<{}, IAppState> {
  constructor(props: any) {
    super(props);
    this.state = {
      filteredPlants: PLANTS,
      plants: PLANTS
    };
    this.handleSearch = this.handleSearch.bind(this);
  }

  public handleSearch(event: any) {
    this.setState({
      filteredPlants: this.state.plants.filter(
        e =>
          e.name.toLowerCase().includes(event.target.value.toLowerCase()) ||
          e.country.toLowerCase().includes(event.target.value.toLowerCase())
      )
    });
  }

  public render() {
    return (
      <div>
        <SearchBox
          type="text"
          placeholder=" Filter plants"
          onChange={this.handleSearch}
        />
        <Listings plants={this.state.filteredPlants} />
      </div>
    );
  }
}

export default Home;
