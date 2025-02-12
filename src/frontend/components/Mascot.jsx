import React from 'react';
import './Mascot.css';

const Mascot = ({ message }) => {
  return (
    <div className="mascot">
      <div className="chick"></div>
      {message && <div className="mascot-message">{message}</div>}
    </div>
  );
};

export default Mascot;
