import React from 'react'
import { connect } from 'react-redux';
import Cookies from 'cookies'
import BasicLayout from "../../layouts/BasicLayout";
import { verify } from 'jsonwebtoken'

import dynamic from 'next/dynamic';

const Home = dynamic(() => import("../../Component/suratkeluar/Home"));

class Index extends React.Component {
  static async getInitialProps({req, res}) {
      const cookies = new Cookies(req, res);
      verify(cookies.get('jwt'), 'aigeqwib', function(err, data) {
        if(err) return {};
        else return {pemohon: {nip: data.organikId, nama: data.nama}};
      });
      try {
        const { organikId, nama } = verify(cookies.get('jwt'), 'aigeqwib');
        return {pemohon: {nip: organikId, nama}};
      }
      catch (ex) { return {} }
    }

  render() {
    return (
      <BasicLayout {...this.props}>
        <Home {...this.props} />
      </BasicLayout>
    )
  }
}

function mapStateToProps(state) {
  const { socket } = state.socket
  return { socket }
}

export default connect(mapStateToProps)(Index)