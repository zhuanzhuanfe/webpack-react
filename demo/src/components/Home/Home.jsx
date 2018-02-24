import React from 'react';

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '这是首页',
    };
  }
  render() {
    return (
      <p>{this.state.name}</p>
    );
  }
}

export default HomePage;