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

const all_seksi = ['Subbagian Umum', 'Sosial', 'Produksi', 'Distribusi', 'Nerwilis', 'IPDS', 'Tidak ada']

export default class Editor extends React.Component {
    state = {
        processing: false,
        autoCompleteDataSource: []
    }
    safeQuery = (q) => {
        if (typeof q === 'string') return q.replace(/[-[\]{}()*+?.,\\/^$|#\s]/g, "\\$&")
        else return q
    }

    resetSearchResult = () => this.setState({ autoCompleteDataSource: [] })
    formRef = React.createRef();
    saveInputRef = input => this.input = input
    render() {
        const { autoCompleteDataSource, processing } = this.state;
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
                            label="Perihal"
                            name="perihal"
                            rules={[
                                {
                                    required: true,
                                    message: 'Mohon isi perihal surat Anda',
                                },
                            ]}
                            hasFeedback
                            validateStatus={undefined}
                        >
                            <AutoComplete
                                allowClear
                                options={autoCompleteDataSource}
                                onSearch={q => this.handleAutoCSearch(q, 'perihal')}
                                style={{ width: "100%" }}
                                disabled={processing}
                                onSelect={this.resetSearchResult}
                            >
                                <TextArea
                                    ref={this.saveInputRef}
                                    placeholder="Perihal surat..."
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
                            validateStatus={undefined}
                        >
                            <AutoComplete
                                allowClear
                                options={autoCompleteDataSource}
                                onSearch={q => this.handleAutoCSearch(q, 'tujuan')}
                                style={{ width: "100%" }}
                                disabled={processing}
                                onSelect={this.resetSearchResult}
                            >
                                <TextArea
                                    placeholder="Tujuan surat..."
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
                            validateStatus={undefined}

                        >
                            <Select style={{ width: 200 }} placeholder="Pilih seksi..." disabled={processing}>
                                {all_seksi.map(seksi => <Option value={seksi} key={seksi}>{seksi}</Option>)}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            wrapperCol={{
                                xs: { span: 24, offset: 0 },
                                sm: { span: 12, offset: 6 },
                            }}
                        >
                            <Button type="primary" onClick={this.onClickAmbilNomor} loading={processing}>Ambil Nomor Baru</Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        )
    }
}