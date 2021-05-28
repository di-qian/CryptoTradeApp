import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { InputGroup, FormControl, ListGroup, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import './SearchBar.css';

const Auto = () => {
  const [display, setDisplay] = useState(false);
  const [options, setOptions] = useState([]);
  const [search, setSearch] = useState('');
  const [disableSearch, setDisableSearch] = useState(true);
  const wrapperRef = useRef(null);

  const cryptoListDetails = useSelector((state) => state.cryptoListDetails);
  const { loading } = cryptoListDetails;

  useEffect(() => {
    const jsonify = (res) => res.json();
    const getAllCryptoTickers = async () => {
      await fetch(
        'https://api.polygon.io/v3/reference/tickers?market=crypto&active=true&sort=ticker&order=asc&limit=1000&' +
          new URLSearchParams({
            apiKey: process.env.REACT_APP_APIKEY,
          })
      )
        .then(jsonify)
        .then((data) => {
          processCurrData(data.results);
        });
    };
    getAllCryptoTickers();
  }, []);

  useEffect(() => {
    if (loading === true) {
      setSearch('');
    }
  }, [loading]);

  useEffect(() => {
    window.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
    };
  });

  const processCurrData = (currencyData) => {
    let processData = [];

    currencyData
      .filter((value) => value.currency_symbol === 'USD')
      .forEach((currData) => {
        const jsonify = (res) => res.json();
        try {
          const FilterAvailableCryptos = async () => {
            await fetch(
              `https://api.polygon.io/v2/aggs/ticker/X:${currData.base_currency_symbol}USD/prev?unadjusted=true&` +
                new URLSearchParams({
                  apiKey: process.env.REACT_APP_APIKEY,
                })
            )
              .then(jsonify)

              .then((data) => {
                if (data.resultsCount === 1) {
                  fetch(
                    `https://api.polygon.io/v1/last/crypto/${currData.base_currency_symbol}/USD?&` +
                      new URLSearchParams({
                        apiKey: process.env.REACT_APP_APIKEY,
                      })
                  )
                    .then(jsonify)
                    .then((data) => {
                      if (data.status === 'success') {
                        var now = new Date();
                        var startOfDay = new Date(
                          now.getFullYear(),
                          now.getMonth(),
                          now.getDate()
                        );

                        var endOfDay = new Date(
                          new Date(
                            now.getFullYear(),
                            now.getMonth(),
                            now.getDate() + 1
                          ) - 1
                        );

                        var startOfDayTimestamp = startOfDay.valueOf();
                        var endOfDayTimestamp = endOfDay.valueOf();

                        fetch(
                          `https://api.polygon.io/v2/aggs/ticker/X:${currData.base_currency_symbol}USD/range/1/minute/${startOfDayTimestamp}/${endOfDayTimestamp}?unadjusted=true&sort=asc&limit=1440&` +
                            new URLSearchParams({
                              apiKey: process.env.REACT_APP_APIKEY,
                            })
                        )
                          .then(jsonify)
                          .then((data) => {
                            data.resultsCount >
                              diff_minutes(now, startOfDay) / 2 &&
                              processData.push({
                                base_currency_symbol:
                                  currData.base_currency_symbol,
                                base_currency_name: currData.base_currency_name,
                              });
                          });
                      }
                    });
                }
              });
            setOptions(processData);
          };
          FilterAvailableCryptos();
        } catch (err) {
          console.log(err);
        }
      });
  };

  const diff_minutes = (dt1, now) => {
    var diff = (now.getTime() - dt1.getTime()) / 1000;
    diff /= 60;
    return Math.abs(Math.round(diff));
  };

  const handleClickOutside = (event) => {
    const { current: wrap } = wrapperRef;
    if (wrap && !wrap.contains(event.target)) {
      setDisplay(false);
    }
  };

  const updateSearchList = (cryptoName) => {
    if (
      options.filter(
        (value) => value.base_currency_symbol === cryptoName.toUpperCase()
      ).length === 1
    ) {
      setDisableSearch(false);
    } else {
      setDisableSearch(true);
    }

    setSearch(cryptoName.toUpperCase());
    setDisplay(false);
  };

  const showSearchBar = (event) => {
    if (event.target.value !== '') {
      setSearch(event.target.value.toUpperCase());

      if (
        options.filter(
          (value) =>
            value.base_currency_symbol === event.target.value.toUpperCase()
        ).length === 1
      ) {
        setDisableSearch(false);
      } else {
        setDisableSearch(true);
      }

      if (!display) {
        setDisplay(true);
      }
    } else {
      setSearch('');
      setDisplay(false);
    }
  };

  const clearInput = () => {
    setSearch('');
  };

  return (
    <div ref={wrapperRef} className="search-bar-dropdown align-items-start">
      <InputGroup>
        <FormControl
          id="auto"
          autoComplete="off"
          onClick={() => setDisplay(false)}
          placeholder="Search Tickers"
          value={search}
          onChange={(event) => showSearchBar(event)}
        />
        <InputGroup.Append>
          <LinkContainer to={`/cryptos/${search}`}>
            <Button
              variant="outline-secondary"
              onClick={() => clearInput()}
              disabled={!search || disableSearch}
            >
              <i className="fa fa-search fa-xs" aria-hidden="true" />
            </Button>
          </LinkContainer>
        </InputGroup.Append>
      </InputGroup>
      {display && (
        <ListGroup className="drop-down-item drop-down-overflow">
          {options
            .filter(
              (value) =>
                value.base_currency_symbol.indexOf(search.toUpperCase()) > -1
            )
            .map((option, i) => {
              return (
                <ListGroup.Item
                  action
                  onClick={() => updateSearchList(option.base_currency_symbol)}
                  key={i}
                >
                  <span className="currency_symbol">
                    {option.base_currency_symbol}
                  </span>
                  <span className="currency_name">
                    {option.base_currency_name}
                  </span>
                </ListGroup.Item>
              );
            })}
        </ListGroup>
      )}
    </div>
  );
};

function SearchBar() {
  return (
    <div>
      <Auto />
    </div>
  );
}

export default SearchBar;
