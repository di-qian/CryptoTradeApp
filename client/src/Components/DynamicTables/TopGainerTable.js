import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import "./TopGainerLoserTable.css";

const TopGainerTable = () => {
  const [gainerData, setGainerData] = useState([]);
  const [sortedData, setSortedData] = useState([]);

  useEffect(() => {
    const newData = gainerData.sort(function (x, y) {
      return y.pt - x.pt;
    });
    setSortedData(newData);
  }, [gainerData]);

  useEffect(() => {
    const getGainers = async () => {
      try {
        const response = await fetch(
          "https://api.polygon.io/v2/snapshot/locale/global/markets/crypto/gainers?" +
            new URLSearchParams({
              apiKey: process.env.REACT_APP_APIKEY,
            })
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        processCurrData(data.tickers.slice(0, 5));
      } catch (err) {
        console.log(err);
      }
    };

    getGainers();
  }, []);

  const processCurrData = (curr_DataSet) => {
    const jsonify = (res) => res.json();

    curr_DataSet.forEach((currData) => {
      fetch(
        `https://api.polygon.io/v3/reference/tickers?ticker=${currData.ticker}&active=true&sort=ticker&order=asc&limit=10&` +
          new URLSearchParams({
            apiKey: process.env.REACT_APP_APIKEY,
          })
      )
        .then(jsonify)
        .then((data) => {
          var outData = {
            p: currData.lastTrade.p,
            pt: currData.todaysChangePerc,
            nm: data.results[0].base_currency_name,
            ticker: data.results[0].base_currency_symbol,
            t: currData.updated,
            v: currData.day.v,
          };
          setGainerData((prevArray) => [...prevArray, outData]);
        });
    });
  };

  return (
    <>
      <h6>Current Top % Gainers</h6>
      <Table>
        <thead>
          <tr>
            <th className="display-number">#</th>
            <th className="display-name">Name</th>
            <th className="display-ticker">Ticker</th>
            <th className="display-price">Price</th>
            <th className="display-percent">24h %</th>
            <th className="display-volume">Vol(24h)</th>
          </tr>
        </thead>
        <tbody>
          {sortedData &&
            sortedData.map((gainer) => (
              <tr key={gainer.ticker}>
                <td className="display-number gain-bd-text">
                  {sortedData.indexOf(gainer) + 1}
                </td>
                <td className="display-name gain-bd-text">{gainer.nm}</td>
                <td className="display-ticker gain-bd-text">{gainer.ticker}</td>
                <td className="display-price gain-bd-text">${gainer.p}</td>
                <td nowrap="nowrap" className="display-percent gain-bd-text">
                  <i className="fas fa-sort-up ctr" />
                  {gainer.pt.toFixed(2)}%
                </td>
                <td className="display-volume gain-bd-text">
                  {gainer.v.toFixed(2)}
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </>
  );
};

export default TopGainerTable;
