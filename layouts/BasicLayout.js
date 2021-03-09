import { Layout, Menu, Dropdown, Avatar } from "antd";
const { Content, Footer, Header } = Layout;

import { ControlFilled, DashboardFilled } from '@ant-design/icons'
import Link from "next/link";

import "./BasicLayout.less"


export default class BasicLayout extends React.Component {
  render() {
    const menu = (
      <Menu className={'menu'} selectedKeys={[]}>
        <Menu.Item key="userCenter">
          <a href='/suratkeluar'>
            <div><ControlFilled /> Surat Keluar</div>
          </a>
        </Menu.Item>
        <Menu.Item key="userCenter">
          <a href='/suratmasuk'>
            <div><DashboardFilled /> Surat Masuk</div>
          </a>
        </Menu.Item>
        {/* <Menu.Item key="userCenter">
          <Link href='/api/login/out'>
            <div><Icon type="logout" /> Logout</div>
          </Link>
        </Menu.Item> */}
      </Menu>
    );
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Layout>
          <Header style={{ background: "#fff", padding: 0, textAlign: "center" }}>
            <span style={{ float: "left", paddingLeft: 25 }}><a href="/"><img className="logo" src={`/logo.png`} /></a></span>
            <span className="right">
              <Dropdown overlay={menu}>
                <span className={`action account`}>
                  <span className={'name'}>Menu</span>
                </span>
              </Dropdown>
            </span>
          </Header>
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