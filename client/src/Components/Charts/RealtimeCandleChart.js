import React, { useState, useEffect, useRef } from 'react';
import CanvasJSReact from './canvasjs.stock.react';
import { useSelector } from 'react-redux';

const RealtimeCandleChart = ({ cryptoTickers }) => {
  var CanvasJSStockChart = CanvasJSReact.CanvasJSStockChart;
  const cryptoListDetails = useSelector((state) => state.cryptoListDetails);
  const { loading, crypto } = cryptoListDetails;
  const [connected, setConnected] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [dataOut, setDataOut] = useState([]);
  const [rangeChangedTriggered, setRangeChangedTriggered] = useState(false);
  const [datapoint1, setDatapoint1] = useState([]);
  const [datapoint2, setDatapoint2] = useState([]);

  const ws = useRef(null);

  var currentDate = new Date();
  var xVal = new Date();
  var yVal;
  var vVal;

  useEffect(() => {
    const wsconnect = () => {
      ws.current = new WebSocket('wss://socket.polygon.io/crypto');

      ws.current.onopen = async () => {
        const auth_data = `{"action":"auth","params":"${process.env.REACT_APP_APIKEY}"}`;
        await ws.current.send(auth_data);
        setConnected(true);
      };
    };

    wsconnect();

    return () => {
      setConnected(false);
      ws.current.close();
    };
  }, []);

  useEffect(() => {
    if (!ws.current || !connected) return;

    let isCancelled = false;
    const runAsync = async () => {
      try {
        if (!isCancelled) {
          if (crypto) {
            const ticker_currency = crypto.asset_ticker + '-' + 'USD';
            const request_data = `{"action":"subscribe", "params":"XA.${ticker_currency}"}`;
            await ws.current.send(request_data);
          }
          ws.current.onmessage = (data) => {
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
            obj[0] &&
              console.log(obj[0].ev === 'XA' ? dataOut : obj[0].message);
          };
        }
      } catch (e) {
        if (!isCancelled) {
          throw e;
        }
      }
    };
    getInitData();
    runAsync();
    return () => {
      if (crypto) {
        const unsubscribe = async () => {
          console.log('candlestick chart websocket unmounted');
          const ticker_currency = crypto.asset_ticker + '-' + 'USD';
          const request_data = `{"action":"unsubscribe", "params":"XA.${ticker_currency}"}`;
          await ws.current.send(request_data);
          setDataOut([]);
          setDatapoint1([]);
          setDatapoint2([]);
          setRangeChangedTriggered([]);
          setIsLoaded(false);
        };
        unsubscribe();
      }
    };
  }, [crypto, loading, connected]);

  useEffect(() => {
    updateChart(dataOut);
  }, [dataOut]);

  const getInitData = () => {
    if (crypto) {
      var now = new Date();
      var startOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );

      var endOfDay = new Date(
        new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1) - 1
      );

      var startOfDayTimestamp = startOfDay.valueOf();
      var endOfDayTimestamp = endOfDay.valueOf();

      const ticker_currency = crypto.asset_ticker + 'USD';

      const jsonify = (res) => res.json();

      try {
        const dataFetch = async () => {
          await fetch(
            `https://api.polygon.io/v2/aggs/ticker/X:${ticker_currency}/range/1/minute/${startOfDayTimestamp}/${endOfDayTimestamp}?unadjusted=true&sort=asc&limit=1440&` +
              new URLSearchParams({
                apiKey: process.env.REACT_APP_APIKEY,
              })
          )
            .then(jsonify)
            .then((data) => {
              let CurrData = [];

              data.results &&
                data.results.forEach((i) => {
                  var dt = new Date(i.t);
                  dt.setMinutes(dt.getMinutes() + 1);

                  CurrData.push({
                    x: dt,
                    y: [Number(i.o), Number(i.h), Number(i.l), Number(i.c)],
                    v: Number(i.v),
                  });
                });

              setInitData(CurrData);
            });
        };
        dataFetch();
      } catch (e) {
        console.log(e);
      }
    }
  };

  const setInitData = (inBaseData) => {
    inBaseData.forEach((i) => {
      xVal = i.x;
      let dps = { x: xVal, y: i.y };
      let dpv = { x: xVal, y: i.v };
      setDatapoint1((currentData) => [...currentData, dps]);
      setDatapoint2((currentData) => [...currentData, dpv]);
    });
    setIsLoaded(true);
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
      options.navigator.slider.minimum = new Date(xVal - 1800 * 1000);
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
        minimum: new Date(currentDate.getTime() - 1800 * 1000),
      },
      axisX: {
        labelFontColor: 'white',
      },
    },
    rangeSelector: {
      enabled: false,
    },
  };

  const printName = () => {
    //console.log(datapoint1);
  };
  return (
    <div>
      {printName()}
      {!isLoaded ? (
        <h3>Please wait, loading...</h3>
      ) : (
        <CanvasJSStockChart options={options} />
      )}
    </div>
  );
};

export default RealtimeCandleChart;
