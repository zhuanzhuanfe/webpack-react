//@flow
import React from 'react';
import { Link } from 'react-router-dom';

class NotFount extends React.Component {
  constructor() {
    super();
    this.state = {
      name: '404页面',
    };
  }
  render() {
    return (
      <div>
        <div className="match-error">
          <p>{this.state.name}</p>
          <Link to="/home">回首页</Link>
        </div>
      </div>
    );
  }
}

export default NotFount;
