import * as React from "react"

import styled from "styled-components"

const Wrapper = styled.div`
    margin-top: 10px;
    width: 100%;
    display: flex;
    justify-content: space-between;
`;

const StyledButton = styled.button`
    min-width: 30%;
    padding: 10px 20px;
    border-radius: 6px;
    border: ${props => props.type === "Danger" ? "2px solid red" : props.type === "Success" ? "2px solid green": "2px solid black"}
    color: ${props => props.type === "Danger" ? "red" : props.type === "Success" ? "green": "black"}
    background: white;
    // font-weight: bold;
    font-size: 18px;
    cursor: pointer;
    -moz-box-shadow: 1px 1px 6px #000000;
    -webkit-box-shadow: 1px 1px 6px #000000;
    box-shadow: 1px 1px 6px #000000;

    :hover {
        background: ${props => props.type === "Danger" ? "red" : props.type === "Success" ? "green": "black"}
        color: white;
    }
`;

class ButtonBar extends React.Component<{},{}> {
    constructor(props:any) {
        super(props)
    }

    public render() {
        return (
            <Wrapper>
                <StyledButton type={"Danger"}>Reset</StyledButton>
                <StyledButton type={"Success"}>Save to Database</StyledButton>
            </Wrapper>
        )
    }
}

export default ButtonBar