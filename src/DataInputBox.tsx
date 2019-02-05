import * as React from "react"

import styled from "styled-components"

import { MdCheck } from "react-icons/md"

import { MdClear } from "react-icons/md"

const InputWrapper = styled.div`
    width: 100%;
    display: flex;
`;

const Icon = styled.div`
    padding: 10px;
    background: ${props => (props.color)};
    color: white;
    min-width: 50px;
    border-radius: 6px 0 0 6px;
    font-size: 40px;
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
    border-radius: 0px !important;
    -webkit-appearance: none;

    :focus {
        border: 2px dotted blue;
    }
`;

interface IAppProps {
    action: any;
    name: any;
    units: string;
    validityState: number;
    value: any;
}

class DataInputBox extends React.Component<IAppProps,{}> {
    constructor(props:any) {
        super(props)
    }


    public render() {
        return (
            <InputWrapper>
                {this.props.validityState === 1 && <Icon color="green"><MdCheck /></Icon>}
                {this.props.validityState === 2 && <Icon color="red"><MdClear /></Icon>}
                <InputBox value={this.props.value} name={this.props.name} onChange={this.props.action}/>
                {this.props.units !== null && <Units>{this.props.units}</Units>}
            </InputWrapper>
        )
    }
}

export default DataInputBox