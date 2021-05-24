import React, { useState, useEffect } from 'react';
import { CanvasJSChart } from 'canvasjs-react-charts';
import { useSelector } from 'react-redux';
import { Spinner } from 'react-bootstrap';
import './AssetPieChart.css';

const AssetPieChart = ({ total_worth_v, latestData }) => {
  const cryptoList = useSelector((state) => state.cryptoList);
  const { cryptos } = cryptoList;

  const [curData, setCurData] = useState([]);
  const [AssetPieChartLoading, setAssetPieChartLoading] = useState(true);
  const [chartoptions, setChartoptions] = useState({});

  useEffect(() => {
    setCurData(latestData);
    const retrieveAssetInfo = () => {
      var count = 0;

      var quantity = 0;

      var curPrice = 0;
      var total_worth = 0;
      var total_worth_rounded = 0;
      var label;
      var legend;
      var dps = [];
      var percent = 0;
      var percent_rounded = 0;
      var plotdata = [];
      var toolTipContent = {};

      if (
        cryptos &&
        cryptos.length === 1 &&
        cryptos[0].asset_ticker === 'Cash' &&
        cryptos[0].quantity === 0
      ) {
        let datapoint = {
          y: 1,
          legendText: 'Profolio is Empty',
          indexLabel: '',
        };

        dps.push(datapoint);

        plotdata = [
          {
            type: 'doughnut',
            showInLegend: true,
            indexLabel: '{label}',
            startAngle: -90,
            color: '#d4d4d4',
            dataPoints: dps,
          },
        ];

        toolTipContent = {
          enabled: false,
        };

        count++;
      } else {
        cryptos.forEach((crypto) => {
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
          percent = (total_worth_rounded / total_worth_v) * 100;
          percent_rounded = percent.toFixed(2);

          let datapoint = {
            y: percent_rounded,
            legendText: legend,
            indexLabel: label,
          };

          dps.push(datapoint);

          total_worth_rounded >= 0 && count++;
        });

        plotdata = [
          {
            type: 'doughnut',
            showInLegend: true,
            indexLabel: '{label}',
            startAngle: -90,

            dataPoints: dps,
          },
        ];

        toolTipContent = {
          enabled: true,
          content: '{legendText} </br> Percentage: {y}%',
        };
      }

      if (count !== 0 && count === cryptos.length) {
        setAssetPieChartLoading(false);
      }

      const options = {
        animationEnabled: true,
        exportEnabled: false,
        theme: 'light1', // "light1", "dark1", "dark2"
        // title: {
        //   text: 'Profolio Breakdown',
        //   fontFamily: 'arial',
        //   fontWeight: 'bold',
        //   fontSize: 20,
        // },
        legend: {
          verticalAlign: 'bottom',
          horizontalAlign: 'center',
        },

        backgroundColor: '#f5f5f5',
        data: plotdata,
        toolTip: toolTipContent,
      };

      setChartoptions(options);
      //return options;
    };

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

    retrieveAssetInfo();
  }, [total_worth_v, cryptos, curData, latestData]);

  return (
    <div className="mb-4 stats__container">
      <div className="stats__header">
        <p className="charttitle">Asset Breakdown</p>
      </div>
      <div className="center">
        {!AssetPieChartLoading ? (
          <CanvasJSChart options={chartoptions} />
        ) : (
          <Spinner animation="border" size="sm" variant="dark" />
        )}
      </div>
    </div>
  );
};

export default AssetPieChart;
