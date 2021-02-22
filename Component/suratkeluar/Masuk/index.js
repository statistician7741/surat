import dynamic from 'next/dynamic';
import { Tabs, PageHeader, Spin } from 'antd';
import Router from 'next/router'
import moment from 'moment'

const { TabPane } = Tabs;

const NomorComp = dynamic(() => import("./Entri"))
const DaftarComp = dynamic(() => import("./Daftar"))

const tabs = ['nomor', 'daftar']

export default class HomeIndex extends React.Component {
    state = {
        activeKey: undefined,
        data: {
            tgl_masuk: moment(),
            _id: undefined,
            tgl_surat: undefined,
            perihal: undefined,
            pengirim: undefined,
            arsip: []
        }
    }

    setData = (data)=>{
        this.setState({data: { ...data }})
    }

    resetData = ()=>this.setState({data: { tgl_masuk: moment(), arsip: [] }})

    render() {
        const { activeKey, data } = this.state;
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
                                data={data}
                                setData={this.setData}
                                resetData={this.resetData}
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