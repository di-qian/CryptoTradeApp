import React, { useState, useEffect } from 'react';
import CanvasJSReact from './canvasjs.stock.react';
var CanvasJSStockChart = CanvasJSReact.CanvasJSStockChart;

const RealtimeCandleChart = ({ crypto, baseData }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  let [dataOut, setDataOut] = useState([]);
  const [rangeChangedTriggered, setRangeChangedTriggered] = useState(false);
  const [datapoint1, setDatapoint1] = useState([]);
  const [datapoint2, setDatapoint2] = useState([]);

  let ws = new WebSocket('wss://socket.polygon.io/crypto');

  var currentDate = new Date();
  var xVal = new Date();
  var yVal;
  var vVal;

  useEffect(() => {
    setIsLoaded(false);
    setDatapoint1([]);
    setDatapoint1([]);
    setDataOut([]);
    setRangeChangedTriggered(false);

    ws.onopen = function (event) {
      const auth_data = `{"action":"auth","params":"${process.env.REACT_APP_APIKEY}"}`;
      ws.send(auth_data);
      if (crypto) {
        const ticker_currency = crypto.asset_ticker + '-' + 'USD';
        const request_data = `{"action":"subscribe", "params":"XA.${ticker_currency}"}`;
        ws.send(request_data);
      }
    };
    ws.onmessage = (data) => {
      let obj = JSON.parse(data.data);

      if (obj[0].ev === 'XA') {
        var dt = new Date(obj[0].s);
        dt.setMinutes(dt.getMinutes() + 1);

        let dataFr = {
          x: dt,
          y: [
            Number(obj[0].o),
            Number(obj[0].h),
            Number(obj[0].l),
            Number(obj[0].c),
          ],
          v: Number(obj[0].v),
        };

        setDataOut((curData) => [...curData, dataFr]);
      }
      obj[0] && console.log(obj[0].ev === 'XA' ? dataOut : obj[0].message);

      return () => {
        ws.close();
      };
    };
    return () => {
      if (crypto) {
        console.log('candlestick chart websocket unmounted');
        const ticker_currency = crypto.asset_ticker + '-' + 'USD';
        const request_data = `{"action":"unsubscribe", "params":"XA.${ticker_currency}"}`;
        ws.send(request_data);
      }
      ws.close();
    };
  }, [crypto]);

  useEffect(() => {
    if (!isLoaded) {
      setInitData(baseData);
    }

    updateChart(dataOut);
  }, [crypto, baseData, dataOut]);

  const setInitData = (inBaseData) => {
    inBaseData.forEach((i) => {
      xVal = i.x;
      let dps = { x: xVal, y: i.y };
      let dpv = { x: xVal, y: i.v };
      setDatapoint1((currentData) => [...currentData, dps]);
      setDatapoint2((currentData) => [...currentData, dpv]);

      setIsLoaded(true);
    });
  };

  const updateChart = (inData) => {
    if (Object.keys(inData).length > 0) {
      xVal = inData[Object.keys(inData).length - 1].x;
      yVal = inData[Object.keys(inData).length - 1].y;
      vVal = inData[Object.keys(inData).length - 1].v;

      let dps = { x: xVal, y: yVal };
      let dpv = { x: xVal, y: vVal };
      setDatapoint1((currentData) => [...currentData, dps]);
      setDatapoint2((currentData) => [...currentData, dpv]);

      setIsLoaded(true);
    }

    if (!rangeChangedTriggered) {
      options.navigator.slider.minimum = new Date(xVal - 600 * 1000);
    }
  };

  const options = {
    theme: 'light2', //"light2", "dark1", "dark2"
    title: {
      text: 'Realtime Update / Minute',
      fontSize: 25,
    },
    rangeChanged: function (e) {
      setRangeChangedTriggered(true);
    },
    charts: [
      {
        axisX: {
          crosshair: {
            enabled: true,
            valueFormatString: 'MMM DD, YYYY HH:mm:ss',
          },
        },
        axisY: {
          title: 'Price in USD',
        },
        toolTip: {
          shared: true,
        },
        data: [
          {
            name: 'Price (in USD)',
            xValueType: 'dateTime',
            xValueFormatString: 'H mm',
            yValueFormatString: '$#,###.##',
            type: 'candlestick',
            dataPoints: datapoint1,
          },
        ],
      },
      {
        height: 100,
        axisY: {
          title: 'Volume',
          tickLength: 0,
        },

        data: [
          {
            name: 'Volume',
            xValueType: 'dateTime',
            xValueFormatString: 'H mm',
            yValueFormatString: '$#,###.##',
            type: 'column',
            dataPoints: datapoint2,
          },
        ],
      },
    ],
    navigator: {
      slider: {
        minimum: new Date(currentDate.getTime() - 600 * 1000),
      },
      axisX: {
        labelFontColor: 'white',
      },
    },
    rangeSelector: {
      enabled: false,
    },
  };

  return (
    <div>
      {!isLoaded ? (
        <h3>Please wait, loading...</h3>
      ) : (
        <CanvasJSStockChart options={options} />
      )}
    </div>
  );
};

export default RealtimeCandleChart;
