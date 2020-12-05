import { Layout } from "antd";
const { Content, Footer } = Layout;

import "./BasicLayout.less"


export default class BasicLayout extends React.Component {
  render() {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Layout>
          <Content
            style={{
              margin: "24px 16px",
              padding: 24,
              background: "#fff",
              minHeight: 280
            }}
          >
            {this.props.children}
          </Content>
          <Footer style={{ textAlign: "center" }}>
            BPS Kab. Kolaka ©{new Date().getFullYear()}
          </Footer>
        </Layout>
      </Layout>
    );
  }
}