import { Row, Col, Divider, Table, Input, Popconfirm } from "antd"
import { EditTwoTone, DeleteTwoTone, DownloadOutlined } from '@ant-design/icons'
import moment from 'moment'
import _ from 'lodash'

const { Search } = Input;

export default class Index extends React.Component {
    state = {
        query: '',
    }

    inputQueryHandler = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    filter = (value, query) => {
        return value ? (_.isString(value) ? value.toLowerCase().includes(query.toLowerCase()) : false) : false
    }

    componentDidMount = () => {
        this.input && this.input.focus()
        if (this.props.socket) {
            this.props.getListSuratKeluar()
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.socket !== prevProps.socket) {
            this.props.getListSuratKeluar()
        }
    }

    saveInputRef = input => this.input = input

    render() {
        let { query } = this.state;
        const { loadingDaftar, all_suratkeluar } = this.props;
        query = [query] || "";

        const daftarColumns = [
            {
                title: 'Nomor',
                dataIndex: 'nomor',
                key: 'nomor',
                width: 90,
                align: 'center',
                filteredValue: query || "",
                onFilter: (query, record) => (
                    this.filter(record.nomor.toString(), query)
                    || this.filter(record.tgl_surat ? moment(record.tgl_surat).format('DD/MM/YYYY') : undefined, query)
                    || this.filter(record.perihal ? record.perihal : 'cadangan', query)
                    || this.filter(record.tujuan ? record.tujuan : undefined, query)
                    || this.filter(record.pemohon ? record.pemohon.nama : undefined, query)
                    || this.filter(record.seksi ? record.seksi : undefined, query)
                ),
            }, {
                title: 'Tanggal Surat',
                dataIndex: 'tgl_surat',
                key: 'tgl_surat',
                width: 160,
                render: (t, r) => t?moment(t).format('DD/MM/YYYY'):'-'
            }, {
                title: 'Arsip',
                dataIndex: 'arsip',
                key: 'arsip',
                width: 80,
                align: 'center',
                render: (t, r) => r.arsip_filename ? <a href={`/arsip/download/${r.arsip_filename}`} title={r.arsip_filename} download><DownloadOutlined /></a> : '-'
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
                title: 'Seksi',
                dataIndex: 'seksi',
                key: 'seksi',
                width: 120,
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
                    <a onClick={() => this.props.onChangeTab('nomor', _id, {...record})}><EditTwoTone /></a>
                    <Divider type="vertical" />
                    <Popconfirm title={`Hapus nomor surat ini?`}okText="Ya" cancelText="Tidak" onConfirm={()=>this.props.deleteSuratKeluar(_id)}>
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
                                placeholder="Ketikkan nomor, tanggal surat, perihal, tujuan, PIC, atau seksi"
                                value={query}
                                onChange={this.inputQueryHandler}
                                onSearch={query => this.setState({ query })}
                                enterButton
                                allowClear
                            />
                        </Col>
                    </Row>
                    <Row type="flex" justify="center">
                        <Col xs={24} sm={24}>
                            <Table
                                loading={loadingDaftar}
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