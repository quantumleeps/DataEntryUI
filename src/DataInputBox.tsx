import * as React from "react"

import styled from "styled-components"

import { FaCheck } from "react-icons/fa"

interface IAppProps {
    units: string;
    valid: boolean;
}

const InputWrapper = styled.div`
    width: 100%;
    display: flex;
`;

const Icon = styled.div`
    padding: 10px;
    background: green;
    color: white;
    min-width: 50px;
    border-radius: 6px 0 0 6px;
    font-size: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const Units = styled.div`
    padding: 10px;
    background: lightgrey;
    color: black;
    min-width: 50px;
    border-radius: 0 6px 6px 0;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const InputBox = styled.input`
    width: 100%;
    padding: 10px;
    outline: none;
    height: 55px;
    font-size: 48px;

    :focus {
        border: 2px solid orange;
    }
`;

class DataInputBox extends React.Component<IAppProps,{}> {
    constructor(props:any) {
        super(props)
    }


    public render() {
        return (
            <InputWrapper>
                {this.props.valid && <Icon><FaCheck /></Icon>}
                <InputBox />
                {this.props.units !== null && <Units>{this.props.units}</Units>}
            </InputWrapper>
        )
    }
}

export default DataInputBox