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
            this.props.getListSuratMasuk()
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.socket !== prevProps.socket) {
            this.props.getListSuratMasuk()
        }
    }

    saveInputRef = input => this.input = input

    render() {
        const { all_suratmasuk } = this.props
        let { query } = this.state;
        query = [query] || "";

        const daftarColumns = [
            {
                title: 'Tanggal Masuk',
                dataIndex: 'tgl_masuk',
                key: 'tgl_masuk',
                width: 150,
                render: (t, r) => t ? moment(t).format('DD/MM/YYYY') : '-'
            }, 
            {
                title: 'Nomor Surat',
                dataIndex: '_id',
                key: '_id',
                width: 150,
                align: 'right',
                filteredValue: query || "",
                onFilter: (query, record) => (
                    this.filter(record._id, query)
                    || this.filter(record.tgl_surat ? moment(record.tgl_surat).format('DD/MM/YYYY') : undefined, query)
                    || this.filter(record.tgl_masuk ? moment(record.tgl_masuk).format('DD/MM/YYYY') : undefined, query)
                    || this.filter(record.perihal ? record.perihal : undefined, query)
                    || this.filter(record.pengirim ? record.pengirim : undefined, query)
                ),
            }, {
                title: 'Tanggal Surat',
                dataIndex: 'tgl_surat',
                key: 'tgl_surat',
                width: 150,
                render: (t, r) => t ? moment(t).format('DD/MM/YYYY') : '-'
            }, {
                title: 'Arsip',
                dataIndex: 'arsip',
                key: 'arsip',
                width: 80,
                align: 'center',
                render: (t, r) => r.arsip_filename ? <a href={`/arsip/suratmasuk/download/${r.arsip_filename}`} title={r.arsip_filename} target="_blank"><DownloadOutlined /></a> : '-'
            }, {
                title: 'Perihal',
                dataIndex: 'perihal',
                key: 'perihal',
                filteredValue: query || "",
                render: (perihal, r) => r.nomor_kosong ? `(cadangan)` : perihal
            }, {
                title: 'Pengirim',
                dataIndex: 'pengirim',
                key: 'pengirim',
                width: 300,
                render: (perihal, r) => r.nomor_kosong ? `-` : perihal
            }, {
                title: 'Pengentri',
                dataIndex: 'pengentri',
                key: 'pengentri',
                width: 120,
                render: (t, r) => '(on progress)'
            },
            {
                title: 'Pilihan',
                dataIndex: '_id',
                key: '_id',
                fixed: 'right',
                align: 'center',
                width: 90,
                render: (_id, record) => <span>
                    <a onClick={() => this.props.onChangeTab('entry', _id, { ...record })}><EditTwoTone /></a>
                    <Divider type="vertical" />
                    <Popconfirm title={`Hapus surat ini?`} okText="Ya" cancelText="Tidak" onConfirm={() => this.props.deleteSuratMasuk(_id)}>
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
                                placeholder="Ketikkan nomor, tanggal surat, perihal, atau pengirim"
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
                                loading={false}
                                scroll={{ x: 1400 }}
                                rowKey='_id'
                                columns={daftarColumns}
                                dataSource={all_suratmasuk}
                                pagination={{ defaultPageSize: 15, showSizeChanger: true, position: 'top', pageSizeOptions: ['15', '30', '50', '100', '200', '500'], showTotal: (total, range) => `${range[0]}-${range[1]} dari ${total} baris` }} />
                        </Col>
                    </Row>
                </Col>
            </Row>
        )
    }
}