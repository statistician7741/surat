import { Layout, Menu, Dropdown, message, Modal, Form, Input } from 'antd';
import axios from 'axios';
const { Content, Footer, Header } = Layout;

import {
  ControlFilled,
  DashboardFilled,
  LockFilled,
  LogoutOutlined,
} from '@ant-design/icons';
import './BasicLayout.less';

const GantiPassForm = ({
  saveInputRef,
  isGantiPassModalVisible,
  isDev,
  onClickGantiPassAkun,
  nip,
}) => {
  const [form] = Form.useForm();
  const onFinish = (data) => {
    const login_api_domain = isDev
      ? 'http://localhost:84'
      : 'https://user-api.bpskolaka.com';
    axios
      .patch(`${login_api_domain}/v1/organiks/${nip}`, data, {
        withCredentials: true,
      })
      .then((response) => {
        message.success('Password berhasil disimpan.');
        onClickGantiPassAkun();
      })
      .catch((error) => {
        console.log(error);
        message.error(error.response.data.message);
      });
  };
  return (
    <Modal
      title="Ganti Password Akun"
      visible={isGantiPassModalVisible}
      onOk={form.submit}
      okText="Simpan"
      onCancel={onClickGantiPassAkun}
    >
      <Form
        wrapperCol={{ span: 24 }}
        onFinish={onFinish}
        autoComplete="off"
        form={form}
        action={`${
          isDev ? 'http://localhost:84' : 'https://user-api.bpskolaka.com'
        }/v1/organiks/${nip}`}
      >
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              pattern: new RegExp(
                /^(?=.{8,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W).*$/
              ),
              message:
                'Password minimal 8 karakter dan harus mengandung huruf besar, huruf kecil, angka, dan symbol.',
            },
          ]}
        >
          <Input.Password
            ref={saveInputRef}
            size="large"
            placeholder="Password baru"
            allowClear
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default class BasicLayout extends React.Component {
  state = { isGantiPassModalVisible: false };
  componentDidMount = () => {
    this.setState({ currentUrl: window.location.href });
  };
  onClickGantiPassAkun = () => {
    this.setState(
      {
        isGantiPassModalVisible: !this.state.isGantiPassModalVisible,
      },
      () => {
        this.input.focus();
      }
    );
  };
  saveInputRef = (input) => (this.input = input);
  render() {
    const { currentUrl, isGantiPassModalVisible } = this.state;
    const { isDev, pemohon } = this.props;
    const menu = (
      <Menu className={'menu'} selectedKeys={[]}>
        <Menu.Item key="sk">
          <a href="/suratkeluar">
            <div>
              <ControlFilled /> Surat Keluar
            </div>
          </a>
        </Menu.Item>
        <Menu.Item key="sm">
          <a href="/suratmasuk">
            <div>
              <DashboardFilled /> Surat Masuk
            </div>
          </a>
        </Menu.Item>
        <Menu.Item key="gp">
          <a href="#" onClick={this.onClickGantiPassAkun}>
            <div>
              <LockFilled /> Ganti Password Akun
            </div>
          </a>
        </Menu.Item>
        <Menu.Item key="l">
          <a
            href={`${
              isDev ? 'http://localhost:3000' : 'https://sso.bpskolaka.com'
            }/keluar?next=${currentUrl}`}
          >
            <div>
              <LogoutOutlined /> Keluar
            </div>
          </a>
        </Menu.Item>
      </Menu>
    );
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Layout>
          <Header
            style={{ background: '#fff', padding: 0, textAlign: 'center' }}
          >
            <span style={{ float: 'left', paddingLeft: 25 }}>
              <a href="/">
                <img className="logo" src={`/logo.png`} />
              </a>
            </span>
            <span className="right">
              <Dropdown overlay={menu}>
                <span className={`action account`}>
                  <span className={'name'}>
                    {pemohon.nama ? pemohon.nama + ' | ' : ''}Menu
                  </span>
                </span>
              </Dropdown>
            </span>
          </Header>
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              background: '#fff',
              minHeight: 280,
            }}
          >
            {this.props.children}
            <GantiPassForm
              saveInputRef={this.saveInputRef}
              isGantiPassModalVisible={isGantiPassModalVisible}
              isDev={isDev}
              onClickGantiPassAkun={this.onClickGantiPassAkun}
              nip={pemohon.nip}
            />
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            BPS Kab. Kolaka ©{new Date().getFullYear()}
          </Footer>
        </Layout>
      </Layout>
    );
  }
}
