import { Row, Col, Button, Form, Input, Select, DatePicker, AutoComplete } from 'antd'
import moment from 'moment'
const { TextArea } = Input
const { Option } = Select

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
    },
};

const all_seksi = ['Tata Usaha', 'Sosial', 'Produksi', 'Distribusi', 'Nerwilis', 'IPDS', 'Tidak ada']

export default class Editor extends React.Component {
    state = {
        processing: false,
        autoCompleteDataSource: []
    }
    onChangeInput = (changedValues) => {
        this.props.setData(changedValues)
    }

    ambilNomor = (data) => {
        this.props.socket.emit('api.master_suratkeluar.editor/simpanSuratKeluar', data, (response) => {
            if (response.type === 'OK') {
                this.props.setData({ nomor: response.data.nomor, _id: response.data._id }, () => {
                    this.setState({ processing: false }, () => {
                        this.props.onSwitchPage('summary');
                    })
                })
            } else {
                this.props.showErrorMessage(response.message)
            }
        })
    }

    onClickAmbilNomor = () => {
        this.setState({ processing: true }, () => this.ambilNomor(this.props.data))
    }
    safeQuery = (q) => {
        if (typeof q === 'string') return q.replace(/[-[\]{}()*+?.,\\/^$|#\s]/g, "\\$&")
        else return q
    }
    handleAutoCSearch = (query, field) => {
        const { socket } = this.props;
        let q = { query: this.safeQuery(query), field }
        socket.emit('api.general.autocomplete/getSuggestion', q, ({ data }) => {
            this.setState({ autoCompleteDataSource: query ? data : [] });
        })
    }

    componentDidMount = () => {
        this.input && this.input.focus()
        this.formRef.current && this.formRef.current.setFieldsValue(this.props.data)
    }
    formRef = React.createRef();
    saveInputRef = input => this.input = input
    render() {
        const { tgl_surat, perihal, tujuan, seksi } = this.props.data;
        const { autoCompleteDataSource, processing } = this.state;
        console.log(this.props);
        return (
            <Row gutter={[64, 0]}>
                <Col xs={24} md={24}>
                    <Form
                        ref={this.formRef}
                        {...formItemLayout}
                        onValuesChange={(changedValues) => this.onChangeInput(changedValues)}
                        initialValues={{
                            tgl_surat: undefined, perihal: undefined, tujuan: undefined, seksi: undefined
                        }}
                    >
                        <Form.Item
                            label="Tanggal Surat"
                            name="tgl_surat"
                            rules={[
                                {
                                    required: true,
                                    message: 'Mohon pilih tanggal surat',
                                },
                            ]}
                            hasFeedback
                            validateStatus={tgl_surat ? "success" : undefined}
                        >
                            <DatePicker
                                disabledDate={(current) => {
                                    return (current.day() === 0 || current.day() === 6 || current.isAfter(moment()))
                                }}
                                format="DD MMMM YYYY"
                                style={{ width: 200 }}
                                disabled={processing}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Perihal"
                            name="perihal"
                            rules={[
                                {
                                    required: true,
                                    message: 'Mohon isi perihal surat Anda',
                                },
                            ]}
                            hasFeedback
                            validateStatus={perihal ? "success" : undefined}
                        >
                            <AutoComplete
                                allowClear
                                options={autoCompleteDataSource}
                                onSearch={q => this.handleAutoCSearch(q, 'perihal')}
                                style={{ width: "100%" }}
                                disabled={processing}
                            >
                                <TextArea
                                    ref={this.saveInputRef}
                                    placeholder="Perihal surat"
                                    style={{ height: 50 }}
                                />
                            </AutoComplete>
                        </Form.Item>
                        <Form.Item
                            label="Tujuan"
                            name="tujuan"
                            rules={[
                                {
                                    required: true,
                                    message: 'Mohon isi tujuan surat Anda',
                                },
                            ]}
                            hasFeedback
                            validateStatus={tujuan ? "success" : undefined}
                        >
                            <AutoComplete
                                allowClear
                                options={autoCompleteDataSource}
                                onSearch={q => this.handleAutoCSearch(q, 'tujuan')}
                                style={{ width: "100%" }}
                                disabled={processing}
                            >
                                <TextArea
                                    placeholder="Tujuan surat"
                                    style={{ height: 50 }}
                                />
                            </AutoComplete>
                        </Form.Item>
                        <Form.Item
                            label="Seksi"
                            name="seksi"
                            rules={[
                                {
                                    required: true
                                },
                            ]}
                            hasFeedback
                            validateStatus={seksi ? "success" : undefined}

                        >
                            <Select style={{ width: 200 }} placeholder="Pilih seksi" disabled={processing}>
                                {all_seksi.map(seksi => <Option value={seksi} key={seksi}>{seksi}</Option>)}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            wrapperCol={{
                                xs: { span: 24, offset: 0 },
                                sm: { span: 12, offset: 6 },
                            }}
                        >
                            <Button type="primary" onClick={this.onClickAmbilNomor} disabled={!tgl_surat || !perihal || !tujuan || !seksi} loading={processing}>Ambil Nomor Baru</Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        )
    }
}