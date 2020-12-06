import { Row, Col, Button, Table, Input } from "antd"
const { Search } = Input;

export default class Index extends React.Component {
    state = {
        query: ''
    }

    inputQueryHandler = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {
        let { query } = this.state;
        query = [query] || "";

        const daftarColumns = [
            {
                title: 'Nomor',
                dataIndex: 'nomor',
                key: 'nomor',
                width: 90,
                sorter: (a, b) => a.nomor - b.nomor
            }, {
                title: 'Tanggal Surat',
                dataIndex: 'tgl_surat',
                key: 'tgl_surat',
                width: 160,
            }, {
                title: 'Perihal',
                dataIndex: 'perihal',
                key: 'perihal',
                // width: 480,
                filteredValue: query || ""
            }, {
                title: 'Tujuan',
                dataIndex: 'tujuan',
                key: 'tujuan',
                width: 300,
            }, {
                title: 'Pembuat',
                dataIndex: 'pembuat',
                key: 'pembuat',
                width: 300,
            },
            {
                title: 'Pilihan',
                dataIndex: 'pilihan',
                fixed: 'right',
                width: 140,
            }
        ]

        return (
            <Row>
                <Col sm={24}>
                    <Row type="flex" justify="center" style={{ paddingBottom: 16 }}>
                        <Col xs={24} sm={12}>
                            <Search
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
                                scroll={{ x: 1450 }}
                                rowKey='_id'
                                columns={daftarColumns}
                                dataSource={[]}
                                pagination={{ defaultPageSize: 15, showSizeChanger: true, position: 'top', pageSizeOptions: ['15', '30', '50', '100', '200', '500'], showTotal: (total, range) => `${range[0]}-${range[1]} dari ${total} baris` }} />
                        </Col>
                    </Row>
                </Col>
            </Row>
        )
    }
}