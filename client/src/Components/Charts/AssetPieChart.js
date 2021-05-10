import React, { useState, useEffect } from 'react';
import { CanvasJSChart } from 'canvasjs-react-charts';
import { useSelector } from 'react-redux';
import { Spinner } from 'react-bootstrap';

const AssetPieChart = (inLatestData) => {
  const cryptoList = useSelector((state) => state.cryptoList);
  const { cryptos } = cryptoList;

  const [curData, setCurData] = useState([]);
  const [AssetPieChartLoading, setAssetPieChartLoading] = useState(true);
  const [chartoptions, setChartoptions] = useState({});

  useEffect(() => {
    setCurData(inLatestData.latestData);
    retrieveAssetInfo();
  }, [inLatestData]);

  const getCryptoCurPrice = (ticker) => {
    if (curData.length > 0) {
      var completeCryptoName = `X:${ticker}USD`;
      var curCrypto = curData.filter(
        (data) => data.ticker === completeCryptoName
      );

      if (curCrypto[0]) {
        var openPrice = {
          o: Number(curCrypto[0].o),
          p: Number(curCrypto[0].p),
        };
      }
      return openPrice;
    }
  };

  const retrieveAssetInfo = () => {
    var count = 0;

    var quantity = 0;

    var curPrice = 0;
    var total_worth = 0;
    var total_worth_rounded = 0;
    var label;
    var legend;
    var dps = [];

    cryptos.map((crypto) => {
      quantity = Number(crypto.quantity);

      curPrice =
        crypto.asset_ticker === 'Cash'
          ? 1.0
          : getCryptoCurPrice(crypto.asset_ticker) &&
            getCryptoCurPrice(crypto.asset_ticker).p;

      total_worth = quantity * curPrice;
      total_worth_rounded = total_worth.toFixed(2);
      label = crypto.asset_name;
      legend = crypto.asset_name + ': $' + total_worth_rounded;

      let datapoint = { y: total_worth, legendText: legend, indexLabel: label };

      dps.push(datapoint);

      total_worth_rounded >= 0 && count++;
    });

    if (count !== 0 && count === cryptos.length) {
      setAssetPieChartLoading(false);
    }

    const options = {
      animationEnabled: true,
      exportEnabled: false,
      theme: 'light1', // "light1", "dark1", "dark2"
      title: {
        text: 'Profolio Breakdown',
        fontFamily: 'arial',
        fontWeight: 'bold',
        fontSize: 20,
      },
      legend: {
        verticalAlign: 'bottom',
        horizontalAlign: 'center',
      },
      data: [
        {
          type: 'doughnut',
          showInLegend: true,
          indexLabel: '{label}',
          startAngle: -90,

          dataPoints: dps,
        },
      ],
    };

    setChartoptions(options);
    //return options;
  };

  return (
    <div>
      {!AssetPieChartLoading ? (
        <CanvasJSChart options={chartoptions} />
      ) : (
        <Spinner animation="border" variant="dark" />
      )}
    </div>
  );
};

export default AssetPieChart;
