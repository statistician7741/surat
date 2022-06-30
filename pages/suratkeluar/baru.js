import React from 'react';
import { connect } from 'react-redux';
import Cookies from 'cookies';
import BasicLayout from '../../layouts/BasicLayout';
import { verify } from 'jsonwebtoken';

import dynamic from 'next/dynamic';
import { setPemohon } from '../../redux/actions/organik.action';
import { setIsDev } from '../../redux/actions/layout.action';

const Home = dynamic(() => import('../../Component/suratkeluar/Home'));

class Index extends React.Component {
  static async getInitialProps({ req, res }) {
    if (!!req) {
      const cookies = new Cookies(req, res);
      try {
        const config = require('../../env.config')
        const isDev = process.env.NODE_ENV === 'development'
        const { organikId, nama } = verify(cookies.get('jwt'), isDev?config.JWT_SECRET_DEV:config.JWT_SECRET_PROD);
        return { pemohonTemp: { nip: organikId, nama }, isDevTemp: isDev };
      } catch (ex) {
        return {isDevTemp: process.env.NODE_ENV === 'development'};
      }
    } else return {}
  }

  componentDidMount = ()=>{
    if(this.props.pemohonTemp) this.props.dispatch(setPemohon(this.props.pemohonTemp))
    if(this.props.isDevTemp) this.props.dispatch(setIsDev(this.props.isDevTemp))    
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
  const { isDev } = state.layout;
  return { socket, pemohon, isDev };
}

export default connect(mapStateToProps)(Index);
