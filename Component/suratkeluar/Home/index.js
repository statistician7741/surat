import dynamic from 'next/dynamic';
import { Tabs, PageHeader } from 'antd';
import Router from 'next/router'

const { TabPane } = Tabs;

const tabs = [{
    name: 'Nomor',
    Component: dynamic(() => import("./TampilkanSuratKeluar"))
}, {
    name: 'Daftar',
    Component: dynamic(() => import("./Daftar"))
}]

export default class HomeIndex extends React.Component {
    state = {

    }

    onChangeTab = (key) => {
        this.setState({ activeKey: key }, () => {
            Router.push({
                pathname: '/suratkeluar/baru',
                query: { tab: key },
            })
        })
    }

    render() {
        const { router } = this.props;
        return (
            <PageHeader
                className="site-page-header"
                title="Surat Keluar"
            >
                <Tabs defaultActiveKey={router.query.tab} onChange={this.onChangeTab} animated={false}>
                    {tabs.map(t => <TabPane tab={`${t.name}`} key={`${t.name}`}>
                        {<t.Component {...this.props} />}
                    </TabPane>)}
                </Tabs>
            </PageHeader>
        )
    }
}