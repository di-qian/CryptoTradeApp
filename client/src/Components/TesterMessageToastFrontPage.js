import React, { useState } from 'react';
import { Toast } from 'react-bootstrap';

const TesterMessageToastFrontPage = () => {
  const [showA, setShowA] = useState(true);

  const toggleShowA = () => setShowA(!showA);

  return (
    <div className="mb-4 ml-2">
      <Toast className="toastwidthfrontpage" show={showA} onClose={toggleShowA}>
        <Toast.Header>
          <i className="fas fa-sticky-note mr-2"></i>
          <strong className="mr-auto">Note to Tester</strong>
        </Toast.Header>
        <Toast.Body>
          <>
            <p>
              Sign up a new account. <br />
              <br />
              Or login as Di Qian - <br />
              Email: diqian@gmail.com <br />
              Password: 123456 <br />
            </p>
          </>
        </Toast.Body>
      </Toast>
    </div>
  );
};

export default TesterMessageToastFrontPage;
