import React from 'react'
import Router from 'next/router'

export default class extends React.Component {
  static async getInitialProps({ req, res }) {
    if (res) {
      res.writeHead(302, {
        Location: `${process.env.NODE_ENV !== 'production'?'http:':'https:'}//${req.hostname}/suratkeluar`
      })
      res.end()
    } else {
      Router.push("/suratkeluar")
    }
    return {}
  }
}