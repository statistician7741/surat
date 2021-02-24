import React from 'react'
import { connect } from 'react-redux';
import BasicLayout from "../../layouts/BasicLayout";

import dynamic from 'next/dynamic';

const Masuk = dynamic(() => import("../../Component/suratkeluar/Masuk"));

class Index extends React.Component {
  static async getInitialProps({ req, res }) {
    return {}
  }

  render() {
    return (
      <BasicLayout {...this.props}>
        <Masuk {...this.props} />
      </BasicLayout>
    )
  }
}

function mapStateToProps(state) {
  const { socket } = state.socket
  return { socket }
}

export default connect(mapStateToProps)(Index)