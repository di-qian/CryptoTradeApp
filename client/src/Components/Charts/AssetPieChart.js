import React, { useState, useEffect } from 'react';
import { CanvasJS, CanvasJSChart } from 'canvasjs-react-charts';
import { useDispatch, useSelector } from 'react-redux';
import { listCryptos } from '../../actions/cryptoActions';

const AssetPieChart = () => {
  const dispatch = useDispatch();
  const cryptoList = useSelector((state) => state.cryptoList);
  const { loading, error, cryptos } = cryptoList;

  useEffect(() => {
    dispatch(listCryptos());
  }, [dispatch]);

  const retrieveAssetInfo = () => {
    var regp = /[^0-9.-]+/g;
    var quantity;
    var purchase_price;
    var total_worth;
    var label;
    var dps = [];

    cryptos.map((crypto) => {
      quantity = Number(crypto.quantity);
      purchase_price = parseFloat(crypto.purchase_price.replace(regp, ''));
      total_worth = quantity * purchase_price;
      label = crypto.asset_name + ': $' + total_worth;

      let datapoint = { y: total_worth, indexLabel: label };
      dps.push(datapoint);
    });

    const options = {
      animationEnabled: false,
      exportEnabled: false,
      theme: 'light1', // "light1", "dark1", "dark2"
      title: {
        text: 'Profolio Breakdown',
      },
      data: [
        {
          type: 'doughnut',
          indexLabel: '{label}: {y}%',
          startAngle: -90,

          dataPoints: dps,
        },
      ],
    };

    return options;
  };

  return (
    <div>
      <CanvasJSChart options={retrieveAssetInfo()} />
    </div>
  );
};

export default AssetPieChart;
