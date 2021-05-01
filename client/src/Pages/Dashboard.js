import React, { useEffect } from 'react';

import { Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { listCryptos } from '../actions/cryptoActions';

import AssetPieChart from '../Components/Charts/AssetPieChart';
import AssetBalanceChart from '../Components/Charts/AssetBalanceChart';
import ProfolioTable from '../Components/DynamicTables/ProfolioTable';

const Dashboard = () => {
  const dispatch = useDispatch();
  const cryptoList = useSelector((state) => state.cryptoList);
  const { loading, error, cryptos } = cryptoList;

  useEffect(() => {
    dispatch(listCryptos());
  }, [dispatch]);

  return (
    <div container-fluid>
      <br />
      <Row>
        <Col className="col-md-4">{/* <AssetBalanceChart /> */}</Col>
        <Col className="col-md-4">
          <AssetPieChart />
        </Col>
        <Col className="col-md-4">
          <ProfolioTable />
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
