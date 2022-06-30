import React from 'react';
import { connect } from 'react-redux';
import Cookies from 'cookies';
import BasicLayout from '../../layouts/BasicLayout';
import { verify } from 'jsonwebtoken';

import dynamic from 'next/dynamic';
import { setPemohon } from '../../redux/actions/organik.action';

const Home = dynamic(() => import('../../Component/suratkeluar/Home'));

class Index extends React.Component {
  static async getInitialProps({ req, res }) {
    if (!!req) {
      const cookies = new Cookies(req, res);
      try {
        const { organikId, nama } = verify(cookies.get('jwt'), '@j4nzky94%@$');
        return { pemohonTemp: { nip: organikId, nama } };
      } catch (ex) {
        return {};
      }
    } else return {}
  }

  componentDidMount = ()=>{
    if(this.props.pemohonTemp) this.props.dispatch(setPemohon(this.props.pemohonTemp))
  }

  render() {
    return (
      <BasicLayout {...this.props}>
        <Home {...this.props} />
      </BasicLayout>
    );
  }
}

function mapStateToProps(state) {
  const { socket } = state.socket;
  const { pemohon } = state.organik;
  return { socket, pemohon };
}

export default connect(mapStateToProps)(Index);
