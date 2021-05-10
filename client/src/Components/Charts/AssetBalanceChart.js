import React, { useState, useEffect } from 'react';
import { CanvasJSChart } from 'canvasjs-react-charts';

const AssetBalanceChart = () => {
  const [dataP, setDataP] = useState([]);

  useEffect(() => {
    const noOfDps = 500;
    var xVal = 1;
    var yVal = 100;
    var dps = [];

    for (var i = 0; i < noOfDps; i++) {
      yVal = yVal + Math.round(5 + Math.random() * (-5 - 5));
      dps.push({ x: xVal, y: yVal });
      xVal++;
    }

    setDataP(dps);
  }, []);

  const options = {
    theme: 'light2', // "light1", "dark1", "dark2"
    animationEnabled: true,
    zoomEnabled: true,
    title: {
      text: 'Try Zooming and Panning',
    },
    data: [
      {
        type: 'area',
        dataPoints: dataP,
      },
    ],
  };

  return (
    <div>
      <CanvasJSChart options={options} />
    </div>
  );
};

export default AssetBalanceChart;
