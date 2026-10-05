import React from 'react';
import './Rating.css';

import { Rate } from 'antd';

function Rating({ value, onChange, disabled }) {
  return (
    <Rate
      className="rating"
      allowHalf
      value={value}
      disabled={disabled}
      allowClear={false}
      count={10}
      onChange={onChange}
    />
  );
}

export default Rating;
