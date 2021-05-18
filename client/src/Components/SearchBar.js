import React, { useEffect, useState, useRef } from 'react';
import { InputGroup, FormControl, ListGroup, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import './SearchBar.css';

const Auto = () => {
  const [display, setDisplay] = useState(false);
  const [options, setOptions] = useState([]);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef(null);

  useEffect(() => {
    const jsonify = (res) => res.json();
    const results = fetch(
      'https://api.polygon.io/v3/reference/tickers?market=crypto&active=true&sort=ticker&order=asc&limit=1000&' +
        new URLSearchParams({
          apiKey: process.env.REACT_APP_APIKEY,
        })
    )
      .then(jsonify)
      .then((data) => {
        processCurrData(data.results);
      });
  }, []);

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
      .map((currData) => {
        const jsonify = (res) => res.json();
        const results = fetch(
          `https://api.polygon.io/v2/snapshot/locale/global/markets/crypto/tickers/X:${currData.base_currency_symbol}USD?&` +
            new URLSearchParams({
              apiKey: process.env.REACT_APP_APIKEY,
            })
        )
          .then(jsonify)

          .then((data) => {
            data.status === 'OK' &&
              processData.push({
                base_currency_symbol: currData.base_currency_symbol,
                base_currency_name: currData.base_currency_name,
              });
          });
      });

    setOptions(processData);
  };

  const handleClickOutside = (event) => {
    const { current: wrap } = wrapperRef;
    if (wrap && !wrap.contains(event.target)) {
      setDisplay(false);
    }
  };

  const updateSearchList = (cryptoName) => {
    setSearch(cryptoName);
    setDisplay(false);
  };

  const showSearchBar = (event) => {
    if (event.target.value !== '') {
      setSearch(event.target.value);
      if (!display) {
        setDisplay(true);
      }
    } else {
      setSearch('');
      setDisplay(false);
    }
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
            <Button variant="outline-secondary" disabled={!search}>
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
