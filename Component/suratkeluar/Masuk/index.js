import dynamic from 'next/dynamic';
import { Tabs, PageHeader, Spin } from 'antd';
import Router from 'next/router'
import axios from 'axios'
import moment from 'moment'

const { TabPane } = Tabs;

const NomorComp = dynamic(() => import("./Entri"))
const DaftarComp = dynamic(() => import("./Daftar"))

const tabs = ['entry', 'daftar']

export default class HomeIndex extends React.Component {
    state = {
        activeKey: undefined,
        all_suratmasuk: [],
        data: {
            tgl_masuk: moment(),
            _id_current: undefined,//'B-002/BPS/80000/01/2019',
            _id: undefined,//'B-002/BPS/80000/01/2019',
            tgl_surat: undefined,//moment('02/01/2019', 'DD/MM/YYYY'),
            perihal: undefined,//'Penyampaian Laporan Keuangan ke Inspektorat Utama',
            pengirim: undefined,//'BPS RI',
            arsip: undefined,
            arsip_filename: undefined
        },
        isEditing: true,
        isSaved: false,
        processing: false,
        loadingDaftar: false,
    }

    setData = (data) => {
        if (data.tgl_masuk && !moment.isMoment(data.tgl_masuk)) data.tgl_masuk = moment(data.tgl_masuk)
        if (data.tgl_surat && !moment.isMoment(data.tgl_surat)) data.tgl_surat = moment(data.tgl_surat)
        this.setState({ data: { ...this.state.data, ...data } })
    }

    deleteSuratMasuk = (id, cb) => {
        this.props.socket.emit('api.master_suratmasuk.basic/deleteSuratByNomor', id, (response) => {
            if (response.type === 'OK') {
                cb && cb()
                this.props.showSuccessMessage("Surat berhasil dihapus")
                this.getListSuratMasuk()
            } else this.props.showErrorMessage("Surat gagal dihapus")
        })
    }

    resetData = (cb) => {
        this.setState({
            all_suratmasuk: [],
            data: {
                tgl_masuk: moment(),
                _id_current: undefined,
                _id: undefined,
                tgl_surat: undefined,
                perihal: undefined,
                pengirim: undefined,
                arsip: undefined,
                arsip_filename: undefined
            },
            isSaved: false,
            isEditing: true,
            loadingRecord: false
        }, () => {
            Router.push({
                pathname: '/suratmasuk',
                query: { tab: 'entry' }
            })
            cb && cb()
        })
    }

    toggleEditing = () => this.setState({ isEditing: true })

    handleSimpan = (fileList) => {
        this.setState({ processing: true }, () => {
            const {
                data: { tgl_masuk, _id, tgl_surat, perihal, pengirim, _id_current },
                isSaved
            } = this.state
            if (fileList.length === 0) {
                this.props.showErrorMessage('Mohon pilih file terlebih dahulu')
                return
            }
            const formData = new FormData();
            const name = fileList[0].name;
            if (!fileList[0].url) {
                fileList.forEach(file => {
                    formData.append('files[]', file);
                });
            }
            if ((this.state.data._id_current !== _id) && isSaved) formData.append('_id_current', _id_current);
            formData.append('tgl_masuk', tgl_masuk);
            formData.append('_id', _id);
            formData.append('tgl_surat', tgl_surat);
            formData.append('perihal', perihal);
            formData.append('pengirim', pengirim);
            this.setState({
                uploading: true,
            }, () => {
                axios.post('/suratkeluar/suratmasuk/entri', formData)
                    .then((response) => {
                        this.setState({
                            uploading: false, data: {
                                ...this.state.data,
                                _id_current: _id,
                                arsip: response.data !== 'arsip unchanged' ? [{
                                    uid: 1,
                                    name,
                                    status: 'done',
                                    url: `/arsip/suratmasuk/download/${response.data}`
                                }] : this.state.data.arsip,
                                arsip_filename: response.data !== 'arsip unchanged' ? response.data : this.state.data.arsip_filename
                            }
                        }, () => {
                            this.props.showSuccessMessage('Berhasil disimpan')
                            this.getListSuratMasuk()
                            this.setState({ processing: false, isEditing: false, isSaved: true })
                            this.setRouter('entry', _id)
                        })
                    })
                    .catch((error) => {
                        this.props.showErrorMessage('Gagal mengupload file. Harap hubungi Administrasi.')
                        this.setState({ uploading: false })
                        console.log(error);
                    });
            });
        })
    }

    setRouter = (key, id, id2) => Router.push({
        pathname: '/suratmasuk',
        query: (id || id2) && key === 'entry' ? { tab: key, id: id || id2 } : { tab: key }
    })

    getSuratByNomor = (id) => {
        this.props.socket.emit('api.master_suratmasuk.entry/getSuratByNomor', id, (response) => {
            if (response.type === 'OK') {
                if (response.suratYgDicari) {
                    this.setState({
                        isEditing: false,
                        isSaved: true,
                    }, () => {
                        this.setData({ ...response.suratYgDicari, _id_current: response.suratYgDicari._id })
                    })
                }
                else this.props.showErrorMessage('Surat tidak ada')
            } else {
                this.props.showErrorMessage('Surat tidak ada')
            }
            this.setState({
                loadingRecord: false
            })
        })
    }

    onChangeTab = (key, id, activeRecord) => {
        if (activeRecord) {
            this.setState({
                activeKey: key,
                isEditing: true
            }, ()=>this.setData(activeRecord))
        } else {
            this.setState({ activeKey: key })
        }
        this.setRouter(key, id, this.state.data ? this.state.data._id : undefined)
    }

    getListSuratMasuk = () => {
        this.setState({ loadingDaftar: true }, () => {
            this.props.socket.emit('api.master_suratmasuk.list/getListSuratMasuk', (response) => {
                if (response.type === 'OK') {
                    this.setState({ all_suratmasuk: response.all_suratmasuk, loadingDaftar: false })
                } else {
                    this.props.showErrorMessage(response.message)
                    this.setState({ loadingDaftar: false })
                }
            })
        })
    }

    componentDidMount = () => {
        if (!this.props.router.query.tab) {
            this.setRouter(tabs[0])
        }
        if (this.props.router.query.id && !this.state.data._id && this.props.socket) {
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
        const { activeKey, data, isEditing, isSaved, processing, loadingRecord, all_suratmasuk, loadingDaftar } = this.state;
        const { router } = this.props;
        return (
            <PageHeader
                className="site-page-header"
                title="Surat Masuk"
            >
                <Tabs defaultActiveKey={router.query.tab} activeKey={activeKey} onChange={this.onChangeTab} animated={false}>
                    <TabPane tab="Entri" key="entry">
                        <Spin spinning={loadingRecord} delay={500}>
                            <NomorComp
                                {...this.props}
                                data={data}
                                isEditing={isEditing}
                                isSaved={isSaved}
                                processing={processing}
                                setData={this.setData}
                                resetData={this.resetData}
                                handleSimpan={this.handleSimpan}
                                toggleEditing={this.toggleEditing}
                                deleteSuratMasuk={this.deleteSuratMasuk}
                            />
                        </Spin>
                    </TabPane>
                    <TabPane tab="Daftar" key="daftar">
                        <DaftarComp
                            {...this.props}
                            all_suratmasuk = {all_suratmasuk}
                            loadingDaftar = {loadingDaftar}
                            getListSuratMasuk = {this.getListSuratMasuk}
                            onChangeTab={this.onChangeTab}
                            deleteSuratMasuk={this.deleteSuratMasuk}
                        />
                    </TabPane>
                </Tabs>
            </PageHeader>
        )
    }
}