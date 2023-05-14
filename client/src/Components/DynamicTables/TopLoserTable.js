import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import "./TopGainerLoserTable.css";

const TopLoserTable = () => {
  const [loserData, setLoserData] = useState([]);
  const [sortedData, setSortedData] = useState([]);

  useEffect(() => {
    const newData = loserData.sort(function (x, y) {
      return x.pt - y.pt;
    });
    setSortedData(newData);
  }, [loserData]);

  useEffect(() => {
    const getLosers = async () => {
      try {
        const response = await fetch(
          "https://api.polygon.io/v2/snapshot/locale/global/markets/crypto/losers?" +
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

    getLosers();
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
          setLoserData((prevArray) => [...prevArray, outData]);
        });
    });
  };

  return (
    <>
      <h6>Current Top % Losers</h6>
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
            sortedData.map((loser) => (
              <tr key={loser.ticker}>
                <td className="display-number lose-bd-text">
                  {sortedData.indexOf(loser) + 1}
                </td>
                <td className="display-name lose-bd-text">{loser.nm}</td>
                <td className="display-ticker lose-bd-text">{loser.ticker}</td>
                <td className="display-price lose-bd-text">${loser.p}</td>
                <td nowrap="nowrap" className="display-percent lose-bd-text">
                  <i className="fas fa-sort-down ctr" /> {loser.pt.toFixed(2)}%
                </td>
                <td className="display-volume lose-bd-text">
                  {loser.v.toFixed(2)}
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </>
  );
};

export default TopLoserTable;
