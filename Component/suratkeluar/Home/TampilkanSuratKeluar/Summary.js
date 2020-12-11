import { Row, Col, Typography, Upload, Button, Form, Input, Select, DatePicker, Space, Popconfirm, AutoComplete, Divider } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import axios from 'axios'
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
        isEditing: false,
        autoCompleteDataSource: [],
        processing: false,
    }

    toggleEditing = () => {
        this.setState({ isEditing: !this.state.isEditing }, () => this.input.focus())
    }

    onChangeInput = (changedValues) => {
        this.props.setData(changedValues)
    }

    handleUpload = () => {
        const { fileList } = this.state;
        const formData = new FormData();
        fileList.forEach(file => {
            formData.append('files[]', file);
        });
        formData.append('_id', this.props.data._id);
        this.setState({
            uploading: true,
        }, () => {
            axios.post('/suratkeluar/arsip/upload', formData)
                .then((response) => {
                    console.log(response);
                    if (response.data === 'OK') {
                        this.setState({ uploading: false }, () => {
                            this.props.showSuccessMessage('Berhasil diupload.')
                        })
                    } else {
                        this.props.showErrorMessage('Gagal mengupload file. Harap hubungi Administrasi.')
                        this.setState({ uploading: false })
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        });
    };
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

    simpan = (data) => {
        this.props.socket.emit('api.master_suratkeluar.editor/simpanSuratKeluar', data, (response) => {
            if (response.type === 'OK') {
                this.setState({ processing: false, isEditing: false }, () => this.props.showSuccessMessage("Berhasil diupdate"))
            } else {
                this.props.showErrorMessage(response.message)
            }
        })
    }

    onRemoveFileUploaded = (filename, cb) => {
        this.props.socket.emit('api.master_suratkeluar.editor/removeFileUploaded', filename, (response) => {
            if (response.type === 'OK') {
                this.props.showSuccessMessage("Arsip berhasil dihapus di server")
            }
            cb()
        })
    }

    onClickSimpan = () => {
        this.setState({ processing: true }, () => this.simpan(this.props.data))
    }

    componentDidMount = () => {
        this.formRef.current && this.formRef.current.setFieldsValue(this.props.data)
    }
    formRef = React.createRef();
    saveInputRef = input => this.input = input
    render() {
        const { uploading, fileList, isEditing, processing } = this.state;
        const { _id, nomor, perihal, tujuan, seksi } = this.props.data;
        const { autoCompleteDataSource } = this.state;
        const props = {
            onRemove: file => {
                this.onRemoveFileUploaded({_id, filename: file.name}, ()=>{
                    this.setState(state => {
                        const index = state.fileList.indexOf(file);
                        const newFileList = state.fileList.slice();
                        newFileList.splice(index, 1);
                        return {
                            fileList: newFileList,
                        };
                    });
                })
            },
            beforeUpload: file => {
                this.setState(state => ({
                    fileList: [file],
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

                            >
                                <span style={{ fontSize: 40 }}>{nomor}</span><Text copyable={{ text: nomor, tooltips: ['Copy?', 'Tercopy!'] }}></Text>
                            </Form.Item>
                            <Form.Item
                                label="Arsip"
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
                            <Divider plain>Detail Surat Keluar</Divider>
                            <Form.Item
                                label="Tanggal Surat"
                                name="tgl_surat"
                            >
                                <DatePicker format="DD MMMM YYYY" style={{ width: 200 }} disabled />
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
                                validateStatus={perihal ? "success" : undefined}
                            >
                                <AutoComplete
                                    allowClear
                                    options={autoCompleteDataSource}
                                    onSearch={q => this.handleAutoCSearch(q, 'perihal')}
                                    style={{ width: "100%" }}
                                    disabled={!isEditing}
                                >
                                    <TextArea
                                        ref={this.saveInputRef}
                                        placeholder="Perihal..."
                                        style={{ height: 50 }}
                                    />
                                </AutoComplete>
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
                                validateStatus={tujuan ? "success" : undefined}
                            >
                                <AutoComplete
                                    allowClear
                                    options={autoCompleteDataSource}
                                    onSearch={q => this.handleAutoCSearch(q, 'tujuan')}
                                    style={{ width: "100%" }}
                                    disabled={!isEditing}
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
                                        required: isEditing,
                                        message: 'Mohon pilih seksi',
                                    },
                                ]}
                                hasFeedback={isEditing}
                                validateStatus={seksi ? "success" : undefined}
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
                                    <Button type="primary" onClick={isEditing ? this.onClickSimpan : this.toggleEditing} disabled={!perihal || !tujuan || !seksi} loading={processing}>{isEditing ? 'Simpan' : 'Edit'}</Button>
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