//@flow
import React from 'react';
import { Link } from 'react-router-dom';

class NotFount extends React.Component {
  constructor() {
    super();
    this.state = {
      name: 'this is a 404 page!',
    };
  }
  render() {
    return (
      <div>
        <div className="match-error">
          <p>URL路径非法，请检查</p>
          <Link to="/home">回首页</Link>
        </div>
      </div>
    );
  }
}

export default NotFount;
