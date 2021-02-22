import { Row, Col, Button, Form, Input, Select, DatePicker, AutoComplete, Upload } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
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

export default class Editor extends React.Component {
    state = {
        processing: false,
        autoCompleteDataSource: [],
        fileList: []
    }
    safeQuery = (q) => {
        if (typeof q === 'string') return q.replace(/[-[\]{}()*+?.,\\/^$|#\s]/g, "\\$&")
        else return q
    }

    componentDidMount = () => {
        this.input && this.input.focus()
        this.formRef.current && this.formRef.current.setFieldsValue(this.props.data)
    }

    resetSearchResult = () => this.setState({ autoCompleteDataSource: [] })
    formRef = React.createRef();
    saveInputRef = input => this.input = input
    render() {
        const { autoCompleteDataSource, processing, fileList } = this.state;
        const { data: { tgl_masuk, _id, tgl_surat, perihal, pengirim } } = this.props
        const props = {
            onRemove: file => {
                this.onRemoveFileUploaded({ _id, filename: file.name }, () => {
                    this.setState(state => {
                        const index = state.fileList.indexOf(file);
                        const newFileList = state.fileList.slice();
                        newFileList.splice(index, 1);
                        return {
                            fileList: newFileList,
                            arsipUploaded: false
                        };
                    });
                })
            },
            beforeUpload: file => {
                this.setState(state => ({
                    fileList: [file],
                    arsipUploaded: false
                }));
                return false;
            },
            fileList,
        };
        console.log(this.props)
        return (
            <Row gutter={[64, 0]}>
                <Col xs={24} md={24}>
                    <Form
                        ref={this.formRef}
                        {...formItemLayout}
                        onValuesChange={(changedValues) => this.props.setData(changedValues)}
                    >
                        <Form.Item
                            label="Tanggal Masuk"
                            name="tgl_masuk"
                            rules={[
                                {
                                    required: true,
                                    message: 'Mohon pilih tanggal surat',
                                },
                            ]}
                            hasFeedback
                            validateStatus={tgl_masuk ? "success" : undefined}
                        >
                            <DatePicker
                                disabledDate={(current) => {
                                    return (current.day() === 0 || current.day() === 6 || current.isAfter(moment()))
                                }}
                                format="DD MMMM YYYY"
                                style={{ width: 200 }}
                                disabled={processing}
                            />
                            {/* <strong>{tgl_surat.format('DD/MM/YYYY')}</strong> (hari ini) */}
                        </Form.Item>
                        <Form.Item
                            label="Nomor Surat"
                            name="_id"
                            rules={[
                                {
                                    required: true,
                                    message: 'Mohon isi nomor surat',
                                },
                            ]}
                            hasFeedback
                            validateStatus={_id ? "success" : undefined}
                        >
                            <Input
                                ref={this.saveInputRef}
                                allowClear
                                placeholder="Nomor surat"
                                style={{ width: "50%" }}
                                disabled={processing}
                                onSelect={this.resetSearchResult}
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
                                    placeholder="Perihal surat..."
                                    style={{ height: 50 }}
                                />
                            </AutoComplete>
                        </Form.Item>
                        <Form.Item
                            label="Pengirim"
                            name="pengirim"
                            rules={[
                                {
                                    required: true,
                                    message: 'Mohon isi pengirim surat ini',
                                },
                            ]}
                            hasFeedback
                            validateStatus={undefined}
                        >
                            <AutoComplete
                                allowClear
                                options={autoCompleteDataSource}
                                onSearch={q => this.handleAutoCSearch(q, 'pengirim')}
                                style={{ width: "100%" }}
                                disabled={processing}
                                onSelect={this.resetSearchResult}
                            >
                                <TextArea
                                    placeholder="Pengirim surat..."
                                    style={{ height: 50 }}
                                />
                            </AutoComplete>
                        </Form.Item>
                        <Form.Item
                            label="Arsip"
                            name="arsip"
                            rules={[
                                {
                                    required: true,
                                    message: 'Mohon pilih file arsip',
                                },
                            ]}
                            hasFeedback
                            validateStatus={fileList.length?true:false}
                        >
                            <Upload {...props}>
                                <Button icon={<UploadOutlined />}>Pilih file</Button>
                            </Upload>
                        </Form.Item>
                        <Form.Item
                            wrapperCol={{
                                xs: { span: 24, offset: 0 },
                                sm: { span: 12, offset: 6 },
                            }}
                        >
                            <Button type="primary" onClick={this.onClickAmbilNomor} loading={processing}>Simpan</Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        )
    }
}