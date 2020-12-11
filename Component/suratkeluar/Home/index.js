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
        activeKey: undefined,
        dataTemp: undefined
    }

    setTab = (key, record, cb)=>this.setState({ activeKey: key, dataTemp: record }, ()=>cb())

    onChangeTab = (key, record) => {
        this.setTab(key, record, () => {
            Router.push({
                pathname: '/suratkeluar/baru',
                query: key==='Nomor'?{ tab: key, _id: record?record._id:'' }:{ tab: key }
            })
        })
        // Router.push({
        //     pathname: '/suratkeluar/baru',
        //     query: key==='Nomor'?{ tab: key, _id }:{ tab: key }
        // })
    }

    render() {
        const { activeKey, dataTemp } = this.state;
        const { router } = this.props;
        return (
            <PageHeader
                className="site-page-header"
                title="Surat Keluar"
            >
                <Tabs defaultActiveKey={router.query.tab} activeKey={activeKey} onChange={this.onChangeTab} animated={false}>
                    {tabs.map(t => <TabPane tab={`${t.name}`} key={`${t.name}`}>
                        {<t.Component {...this.props} onChangeTab={this.onChangeTab} tab={router.query.tab} _id={router.query._id} dataTemp={dataTemp} />}
                    </TabPane>)}
                </Tabs>
            </PageHeader>
        )
    }
}