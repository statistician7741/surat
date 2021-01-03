import dynamic from 'next/dynamic';
import { Tabs, PageHeader, Spin } from 'antd';
import Router from 'next/router'
import moment from 'moment'

const { TabPane } = Tabs;

const NomorComp = dynamic(() => import("./TampilkanSuratKeluar"))
const DaftarComp = dynamic(() => import("./Daftar"))

const tabs = ['nomor', 'daftar']

export default class HomeIndex extends React.Component {
    state = {
        activeKey: undefined,
        loadingRecord: true,
        data: {
            nomor: undefined,
            tgl_surat: moment(),
            perihal: undefined,
            tujuan: undefined,
            seksi: undefined
        },
        all_suratkeluar: [],
        loadingDaftar: false,
        isEditing: false,
        minDate: undefined,
        maxDate: undefined
    }

    toggleEditing = (_id, justToggle, cb) => {
        if (!justToggle) {
            this.props.socket.emit('api.master_suratkeluar.summary/getConstraintDate', _id, (response) => {
                // console.log(response);
                // return
                if (response.type === 'OK') {
                    this.setState({
                        ...response.data,
                        isEditing: !this.state.isEditing
                    }, cb&&cb)
                } else {
                    this.props.showErrorMessage(response.message)
                }
            })
        } else{
            this.setState({ isEditing: !this.state.isEditing }, () => {
                cb && cb()
            })
        }
    }

    getListSuratKeluar = () => {
        this.setState({ loadingDaftar: true }, () => {
            this.props.socket.emit('api.master_suratkeluar.list/getListSuratKeluar', (response) => {
                if (response.type === 'OK') {
                    this.setState({ all_suratkeluar: response.all_suratkeluar, loadingDaftar: false })
                } else {
                    this.props.showErrorMessage(response.message)
                    this.setState({ loadingDaftar: false })
                }
            })
        })
    }

    deleteSuratKeluar = (id, cb) => {
        this.props.socket.emit('api.master_suratkeluar.basic/deleteSuratByNomor', id, (response) => {
            if (response.type === 'OK') {
                this.props.showSuccessMessage("Surat berhasil dihapus")
                this.getListSuratKeluar()
                cb && cb()
            } else this.props.showErrorMessage("Surat gagal dihapus")
        })
    }

    setData = (data, action) => {
        if (data.tgl_surat) {
            if (!moment.isMoment(data.tgl_surat)) data.tgl_surat = moment(data.tgl_surat)
        }
        else if (data.nomor_kosong === true && data.nomor_kosong !== undefined)
            data.tgl_surat = undefined
        this.setState({ data: action === 'editing' ? { ...this.state.data, ...data } : { ...data } })
    }

    resetAmbilNomorBaru = () => {
        Router.push({
            pathname: '/suratkeluar/baru',
            query: { tab: 'nomor' }
        })
        this.setState({ data: { tgl_surat: moment() } })
    }

    setRouter = (key, id, id2) => Router.push({
        pathname: '/suratkeluar/baru',
        query: (id || id2) && key === 'nomor' ? { tab: key, id: id || id2 } : { tab: key }
    })

    onChangeTab = (key, id, activeRecord) => {
        if (activeRecord) {
            if (activeRecord.tgl_surat) {
                if (!moment.isMoment(activeRecord.tgl_surat)) activeRecord.tgl_surat = moment(activeRecord.tgl_surat)
            }
            else if (activeRecord.nomor_kosong === true)
                activeRecord.tgl_surat = undefined
            this.setState({
                activeKey: key,
                data: activeRecord,
                isEditing: false
            })
        } else {
            this.setState({ activeKey: key })
        }
        this.setRouter(key, id, this.state.data ? this.state.data._id : undefined)
    }

    getSuratByNomor = (id) => {
        this.props.socket.emit('api.master_suratkeluar.summary/getSuratByNomor', id, (response) => {
            if (response.type === 'OK') {
                if (response.suratYgDicari)
                    this.setData(response.suratYgDicari, 'editing')
                else this.props.showErrorMessage('Surat tidak ada')
            } else {
                this.props.showErrorMessage(response.message)
            }
            this.setState({ loadingRecord: false })
        })
    }

    componentDidMount = () => {
        if (!this.props.router.query.tab) {
            this.setRouter(tabs[0])
        }
        if (this.props.router.query.id && !this.state.data.nomor && this.props.socket) {
            //getRecord from server
            this.getSuratByNomor(this.props.router.query.id)
            //handle if not found/forbidden
        } else {
            this.setState({ loadingRecord: false })
        }
    }

    componentDidUpdate = (prevProps) => {
        if (this.props.socket !== prevProps.socket) {
            this.getSuratByNomor(this.props.router.query.id)
        }
    }

    render() {
        const { activeKey, data, loadingRecord, all_suratkeluar, loadingDaftar, isEditing, minDate, maxDate } = this.state;
        const { router } = this.props;
        return (
            <PageHeader
                className="site-page-header"
                title="Surat Keluar"
            >
                <Tabs defaultActiveKey={router.query.tab} activeKey={activeKey} onChange={this.onChangeTab} animated={false}>
                    <TabPane tab="Nomor" key="nomor">
                        <Spin spinning={loadingRecord} delay={500}>
                            <NomorComp
                                {...this.props}
                                data={data}
                                isEditing={isEditing}
                                setData={this.setData}
                                resetAmbilNomorBaru={this.resetAmbilNomorBaru}
                                getListSuratKeluar={this.getListSuratKeluar}
                                deleteSuratKeluar={this.deleteSuratKeluar}
                                toggleEditing={this.toggleEditing}
                                maxDate={maxDate}
                                minDate={minDate}
                            />
                        </Spin>
                    </TabPane>
                    <TabPane tab="Daftar" key="daftar">
                        <DaftarComp
                            {...this.props}
                            onChangeTab={this.onChangeTab}
                            all_suratkeluar={all_suratkeluar}
                            loadingDaftar={loadingDaftar}
                            getListSuratKeluar={this.getListSuratKeluar}
                            deleteSuratKeluar={this.deleteSuratKeluar}
                        />
                    </TabPane>
                </Tabs>
            </PageHeader>
        )
    }
}