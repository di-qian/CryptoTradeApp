import React, { useState } from 'react';
import { Toast, Table } from 'react-bootstrap';

const TesterMessageToast = () => {
  const [showA, setShowA] = useState(true);

  const toggleShowA = () => setShowA(!showA);

  return (
    <div className="mb-4 ">
      <Toast className="toastwidth" show={showA} onClose={toggleShowA}>
        <Toast.Header>
          <i className="fas fa-sticky-note mr-2"></i>
          <strong className="mr-auto">Note to Tester</strong>
        </Toast.Header>
        <Toast.Body>
          <div className="toasttext ">
            On next screen, please use tester credit card number listed below.{' '}
            <b>DO NOT</b> enter your personal credit card information! No credit
            card information will be saved on this site.
          </div>
          <br />

          <Table>
            <tbody>
              <tr>
                <td>
                  <table>
                    <tbody>
                      <tr className="toasttablehead">
                        <td>NUMBER :</td>
                      </tr>
                      <tr className="toasttablehead">
                        <td>DATE :</td>
                      </tr>
                      <tr className="toasttablehead">
                        <td>CVC :</td>
                      </tr>
                    </tbody>
                  </table>
                </td>

                <td>
                  <table>
                    <tbody>
                      <tr>
                        <td>4242 4242 4242 4242</td>
                      </tr>
                      <tr>
                        <td>Any future date</td>
                      </tr>
                      <tr>
                        <td>Any 4 digits</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </Table>
          <br />
        </Toast.Body>
      </Toast>
    </div>
  );
};

export default TesterMessageToast;
