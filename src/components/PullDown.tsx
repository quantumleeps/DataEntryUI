import * as React from "react"


{/* <PullDown handleChange={this.handleViewChange} selectedView={"bobby"} views={[{id: "x", name: "bob"}, {id: "y", name: "bobby"}, {id: "z", name: "jones"}]} /> */}

const PullDown = (props:any) => {
    const options = props.views.map((view:any) => {
        return(<option key={view.id}>{view.name}</option>)
    })
    return (
        <select onChange={props.handleChange} value={props.selectedView}>
            {options}
        </select>
    )
}

export default PullDown