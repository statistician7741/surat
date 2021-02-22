import dynamic from 'next/dynamic';
import { Tabs, PageHeader, Spin } from 'antd';
import Router from 'next/router'
import moment from 'moment'

const { TabPane } = Tabs;

const NomorComp = dynamic(() => import("./View"))
const DaftarComp = dynamic(() => import("./Daftar"))

const tabs = ['nomor', 'daftar']

export default class HomeIndex extends React.Component {
    state = {
        activeKey: undefined,
    }

    render() {
        const { activeKey, all_suratmasuk, loadingDaftar } = this.state;
        const { router } = this.props;
        return (
            <PageHeader
                className="site-page-header"
                title="Surat Masuk"
            >
                <Tabs defaultActiveKey={router.query.tab} activeKey={activeKey} onChange={this.onChangeTab} animated={false}>
                    <TabPane tab="Nomor" key="nomor">
                        <Spin spinning={false} delay={500}>
                            <NomorComp
                                {...this.props}
                            />
                        </Spin>
                    </TabPane>
                    <TabPane tab="Daftar" key="daftar">
                        <DaftarComp
                            {...this.props}
                        />
                    </TabPane>
                </Tabs>
            </PageHeader>
        )
    }
}