import { Row, Col, Typography, Upload, Button, Form, Input, Select, DatePicker, Space, Popconfirm } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import reqwest from 'reqwest';
const { Text } = Typography
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
        fileList: [],
        uploading: false,
        isEditing: false
    }

    toggleEditing = () => this.setState({ isEditing: !this.state.isEditing })

    onChangeInput = (changedValues) => {
        this.props.setData(changedValues)
    }

    handleUpload = () => {
        const { fileList } = this.state;
        const formData = new FormData();
        fileList.forEach(file => {
            formData.append('files[]', file);
        });

        this.setState({
            uploading: true,
        });

        // You can use any AJAX library you like
        reqwest({
            url: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
            method: 'post',
            processData: false,
            data: formData,
            success: () => {
                this.setState({
                    fileList: [],
                    uploading: false,
                });
                this.props.showSuccessMessage('upload successfully.');
            },
            error: () => {
                this.setState({
                    uploading: false,
                });
                this.props.showErrorMessage('upload failed.');
            },
        });
    };

    componentDidMount = () => {
        this.formRef.current && this.formRef.current.setFieldsValue(this.props.data)
    }
    formRef = React.createRef();

    render() {
        const { uploading, fileList, isEditing } = this.state;
        const { data } = this.props;
        const props = {
            onRemove: file => {
                this.setState(state => {
                    const index = state.fileList.indexOf(file);
                    const newFileList = state.fileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        fileList: newFileList,
                    };
                });
            },
            beforeUpload: file => {
                this.setState(state => ({
                    fileList: [...state.fileList, file],
                }));
                return false;
            },
            fileList,
        };
        return (
            <>
                <Row gutter={[64, 0]}>
                    <Col xs={24} md={24}>
                        <Form
                            ref={this.formRef}
                            {...formItemLayout}
                            onValuesChange={(changedValues) => this.onChangeInput(changedValues)}
                        >
                            <Form.Item
                                label="Nomor Surat"
                                name="nomor_surat"

                            >
                                <span style={{ fontSize: 30 }}>242/74041/12/2020</span><Text copyable={{ text: "242/74041/12/2020", tooltips: ['Copy?', 'Tercopy!'] }}></Text>
                            </Form.Item>
                            <Form.Item
                                label="Arsip"
                                name="arsip"
                                extra="mohon upload arsip surat"
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
                                <Button
                                    type="primary"
                                    onClick={this.handleUpload}
                                    disabled={fileList.length === 0}
                                    loading={uploading}
                                >
                                    {uploading ? 'Uploading...' : 'Upload arsip'}
                                </Button>
                            </Form.Item>
                            <Form.Item
                                label="Tanggal Surat"
                                name="tgl_surat"
                                rules={[
                                    {
                                        required: isEditing,
                                        message: 'Mohon pilih tanggal surat',
                                    },
                                ]}
                                hasFeedback={isEditing}
                                validateStatus={data.tgl_surat?"success":undefined}
                            >
                                <DatePicker format="DD MMMM YYYY" style={{ width: 200 }}  disabled={!isEditing} />
                            </Form.Item>
                            <Form.Item
                                label="Perihal"
                                name="perihal"
                                rules={[
                                    {
                                        required: isEditing,
                                        message: 'Mohon isi perihal surat',
                                    },
                                ]}
                                hasFeedback={isEditing}
                                validateStatus={data.perihal?"success":undefined}
                            >
                                <TextArea
                                    placeholder="Perihal..."
                                    style={{ height: 50 }}
                                    disabled={!isEditing}
                                />
                            </Form.Item>
                            <Form.Item
                                label="Tujuan"
                                name="tujuan"
                                rules={[
                                    {
                                        required: isEditing,
                                        message: 'Mohon isi tujuan surat',
                                    },
                                ]}
                                hasFeedback={isEditing}
                                validateStatus={data.tujuan?"success":undefined}
                            >
                                <TextArea
                                    placeholder="Tujuan surat..."
                                    style={{ height: 50 }}
                                    disabled={!isEditing}
                                />
                            </Form.Item>
                            <Form.Item
                                label="Seksi"
                                name="seksi"
                                rules={[
                                    {
                                        required: isEditing,
                                        message: 'Mohon pilih seksi',
                                    },
                                ]}
                                hasFeedback={isEditing}
                                validateStatus={data.seksi?"success":undefined}
                            >
                                <Select style={{ width: 200 }} disabled={!isEditing}>
                                    {all_seksi.map(seksi => <Option value={seksi} key={seksi}>{seksi}</Option>)}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                wrapperCol={{
                                    xs: { span: 24, offset: 0 },
                                    sm: { span: 12, offset: 6 },
                                }}
                            >
                                <Space>
                                    <Button type="primary" onClick={this.toggleEditing}>{isEditing ? 'Simpan' : 'Edit'}</Button>
                                    <Popconfirm placement="topRight" title={`Hapus nomor surat ini?`} okText="Ya" cancelText="Tidak">
                                        <Button type="danger">Hapus</Button>
                                    </Popconfirm>
                                </Space>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </>
        )
    }
}