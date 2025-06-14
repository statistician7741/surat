import React from 'react'
import Router from 'next/router'
import config from '../../env.config'

export default class extends React.Component {
  static async getInitialProps({ req, res }) {
    if (res) {
      res.writeHead(302, {
        Location: `${config.SISUKMA_HOST}/suratkeluar/baru`
      })
      res.end()
    } else {
      Router.push("/")
    }
    return {}
  }
}