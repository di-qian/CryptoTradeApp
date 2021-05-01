import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import './ProfolioTable.css';

const ProfolioTableRow = (props) => {
  const difference = props.price - props.openPrice;
  const percentage = (difference / props.openPrice) * 100;
  const worth = (props.volume * props.price).toFixed(2);

  return (
    <LinkContainer to={`/cryptos/${props.ticker}`}>
      <div className="profoliorow">
        <div className="row__intro">
          <h1>{props?.name}</h1>
          <p>{props.volume && props.volume + ' shares ($' + worth + ')'}</p>
        </div>

        <div className="row__numbers">
          <p className="row__price">
            ${props.price ? props.price.toFixed(2) : 'loading...'}
          </p>
          <p
            className={
              percentage >= 0 ? 'row__percentage_pos' : 'row__percentage_neg'
            }
          >
            {' '}
            {percentage >= 0 ? '+' : '-'}$
            {difference ? difference.toFixed(2) : 'loading...'}
          </p>
          <p
            className={
              percentage >= 0 ? 'row__percentage_pos' : 'row__percentage_neg'
            }
          >
            {percentage >= 0 ? '+' : '-'}
            {percentage ? Number(percentage).toFixed(2) : 'loading...'}%
          </p>
        </div>
      </div>
    </LinkContainer>
  );
};

export default ProfolioTableRow;
