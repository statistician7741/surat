import React from 'react'
import Router from 'next/router'

export default class extends React.Component {
  static async getInitialProps({ req, res }) {
    if (res) {
      res.writeHead(302, {
        Location: `http://${req.hostname}:83/suratkeluar/baru`
      })
      res.end()
    } else {
      Router.push("/")
    }
    return {}
  }
}