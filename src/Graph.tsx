import * as React from "react";
import ChartistGraph from "react-chartist";

class Graph extends React.Component<{}, {}> {
  public render() {

    const simpleLineChartData = {
        labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        series: [
          [12, 9, 7, 8, 5],
          [2, 1, 3.5, 7, 3],
          [1, 3, 4, 5, 6]
        ]
      }
    // const data = {
    //   labels: ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8", "W9", "W10"],
    //   series: [[1, 2, 4, 8, 6, -2, -1, -4, -6, -2]]
    // };

    // const options = {
    //     axisX: {
    //         labelInterpolationFnc: (value: any, index: any) => {
    //           return index % 2 === 0 ? value : null;
    //         }
    //       },
    //   high: 10,
    //   low: -10
    // };

    // const type = "Bar";
    return (
      <div>
        <ChartistGraph style={{ backgroundColor: "white" }} data={simpleLineChartData} type={'Line'} />
      </div>
    );
  }
}

export default Graph;
