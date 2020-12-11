import { Row, Col, Divider, Table, Input, Popconfirm } from "antd"
import { EditTwoTone, DeleteTwoTone, DownloadOutlined } from '@ant-design/icons'
import moment from 'moment'
import Router from 'next/router'
const { Search } = Input;

export default class Index extends React.Component {
    state = {
        query: '',
        loading: true,
        all_suratkeluar: []
    }

    inputQueryHandler = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    getListSuratKeluar = () => {
        this.props.socket.emit('api.master_suratkeluar.list/getListSuratKeluar', (response) => {
            if (response.type === 'OK') {
                this.setState({ all_suratkeluar: response.all_suratkeluar, loading: false })
            } else {
                this.props.showErrorMessage(response.message)
                this.setState({ loading: false })
            }
        })
    }

    componentDidMount = () => {
        this.input && this.input.focus()
        if (this.props.socket && !this.state.all_suratkeluar.length) {
            this.getListSuratKeluar()
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.socket !== prevProps.socket) {
            this.getListSuratKeluar()
        }
    }

    saveInputRef = input => this.input = input

    render() {
        let { query, loading, all_suratkeluar } = this.state;
        query = [query] || "";

        const daftarColumns = [
            {
                title: 'Nomor',
                dataIndex: 'nomor',
                key: 'nomor',
                width: 90,
                align: 'center',
                sorter: (a, b) => a.nomor - b.nomor
            }, {
                title: 'Tanggal Surat',
                dataIndex: 'tgl_surat',
                key: 'tgl_surat',
                width: 160,
                render: (t, r) => moment(t).format('DD/MM/YYYY')
            }, {
                title: 'Arsip',
                dataIndex: 'arsip',
                key: 'arsip',
                width: 80,
                align: 'center',
                render: (t, r) => r.arsip_filename ? <a href="#" title={r.arsip_filename}><DownloadOutlined /></a> : null
            }, {
                title: 'Perihal',
                dataIndex: 'perihal',
                key: 'perihal',
                filteredValue: query || "",
                render: (perihal, r) => r.nomor_kosong ? `(cadangan)` : perihal
            }, {
                title: 'Tujuan',
                dataIndex: 'tujuan',
                key: 'tujuan',
                width: 300,
                render: (perihal, r) => r.nomor_kosong ? `-` : perihal
            }, {
                title: 'PIC',
                dataIndex: 'pemohon.nama',
                key: 'pemohon.nama',
                width: 300,
                render: (t, r) => r.pemohon ? r.pemohon.nama : '-'
            },
            {
                title: 'Pilihan',
                dataIndex: '_id',
                key: '_id',
                fixed: 'right',
                align: 'center',
                width: 90,
                render: (_id, record) => <span>
                    <a onClick={() => this.props.onChangeTab('Nomor', record)}><EditTwoTone /></a>
                    <Divider type="vertical" />
                    <Popconfirm title={`Hapus nomor surat ini?`}>
                        <DeleteTwoTone twoToneColor="#eb2f96" />
                    </Popconfirm>
                </span>

            }]

        return (
            <Row>
                <Col sm={24}>
                    <Row type="flex" justify="center" style={{ paddingBottom: 16 }}>
                        <Col xs={24} sm={12}>
                            <Search
                                ref={this.saveInputRef}
                                size="large"
                                name="query"
                                placeholder="Ketikkan nomor, perihal, tujuan, atau seksi surat..."
                                value={query}
                                onChange={this.inputQueryHandler}
                                onSearch={query => this.setState({ query })}
                                enterButton
                            />
                        </Col>
                    </Row>
                    <Row type="flex" justify="center">
                        <Col xs={24} sm={24}>
                            <Table
                                loading={loading}
                                scroll={{ x: 1450 }}
                                rowKey='_id'
                                columns={daftarColumns}
                                dataSource={all_suratkeluar}
                                pagination={{ defaultPageSize: 15, showSizeChanger: true, position: 'top', pageSizeOptions: ['15', '30', '50', '100', '200', '500'], showTotal: (total, range) => `${range[0]}-${range[1]} dari ${total} baris` }} />
                        </Col>
                    </Row>
                </Col>
            </Row>
        )
    }
}