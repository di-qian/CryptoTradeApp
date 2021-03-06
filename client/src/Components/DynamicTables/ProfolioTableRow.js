import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import './ProfolioTable.css';

const ProfolioTableRow = (props) => {
  var difference;
  var percentage;
  var worth;

  if (props.price && props.openPrice && props.volume) {
    difference = props.price - props.openPrice;
    percentage = (difference / props.openPrice) * 100;
    worth = (props.volume * props.price).toFixed(2);
  }

  return (
    <LinkContainer to={`/cryptos/${props.ticker}`}>
      <div className="profoliorow">
        <div className="row__intro">
          <h1>{props?.name}</h1>
          <span>
            {worth
              ? props.volume &&
                props.volume.toFixed(6) + ' shares ($' + worth + ')'
              : 'loading...'}
          </span>
        </div>

        <div className="row__numbers">
          <p className="row__price">
            {props.price ? '$' + props.price.toFixed(2) : ''}
          </p>
          <p
            className={
              percentage >= 0 ? 'row__percentage_pos' : 'row__percentage_neg'
            }
          >
            {' '}
            {difference ? '$' + difference.toFixed(2) : 'loading...'}
          </p>
          <p
            className={
              percentage >= 0 ? 'row__percentage_pos' : 'row__percentage_neg'
            }
          >
            {percentage ? Number(percentage).toFixed(2) + '%' : ''}
          </p>
        </div>
      </div>
    </LinkContainer>
  );
};

export default ProfolioTableRow;
