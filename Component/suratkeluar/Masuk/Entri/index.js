import {
    Row,
    Col,
    Button,
    Form,
    Input,
    Select,
    DatePicker,
    AutoComplete,
    Upload,
    Space,
    Popconfirm,
    PageHeader
} from 'antd'
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
        autoCompleteDataSource: [],
        fileList: []
    }
    safeQuery = (q) => {
        if (typeof q === 'string') return q.replace(/[-[\]{}()*+?.,\\/^$|#\s]/g, "\\$&")
        else return q
    }

    handleAutoCSearch = (query, field) => {
        const { socket } = this.props;
        let q = { query: this.safeQuery(query), field }
        socket.emit('api.general.autocomplete/getSuggestSM', q, ({ data }) => {
            this.setState({ autoCompleteDataSource: query ? data : [] });
        })
    }

    normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    setDataToForm = () => {
        this.formRef.current && this.formRef.current.setFieldsValue(this.props.data)
    }

    resetForm = () => {
        this.props.resetData(() => {
            this.setState({ fileList: [] }, () => {
                this.formRef.current && this.formRef.current.resetFields()
                this.setDataToForm()
                setTimeout(() => {
                    this.input && this.input.focus()
                }, 200)
            })
        })
    }


    setArsip = () => {
        if (this.props.data.arsip) {
            if (!this.props.data.arsip.fileList) {
                const fileList = this.props.data.arsip_filename ? [{
                    uid: 1,
                    name: this.props.data.arsip_filename,
                    status: 'done',
                    url: `/arsip/suratmasuk/download/${this.props.data.arsip_filename}`
                }] : []
                this.setState({ fileList })
            }
        } else if (this.props.data.arsip_filename) {
            const fileList = this.props.data.arsip_filename ? [{
                uid: 1,
                name: this.props.data.arsip_filename,
                status: 'done',
                url: `/arsip/suratmasuk/download/${this.props.data.arsip_filename}`
            }] : []
            this.setState({ fileList })
        } else {
            this.setState({ fileList: [] })
        }
    }

    componentDidMount = () => {
        this.setArsip()
        this.setDataToForm()
        this.input && this.input.focus()
    }

    componentDidUpdate = (prevProps) => {
        if (prevProps.data !== this.props.data) {
            this.setArsip()
            // if (this.props.isEditing)
            //     this.formRef.current && this.formRef.current.setFieldsValue({
            //         arsip: this.props.data.arsip
            //     })
            // else this.setDataToForm()
            this.setDataToForm()
        }
    }

    resetSearchResult = () => this.setState({ autoCompleteDataSource: [] })
    formRef = React.createRef();
    saveInputRef = input => this.input = input
    render() {
        const { autoCompleteDataSource, fileList } = this.state;
        const {
            data: { tgl_masuk, _id, tgl_surat, perihal, pengirim, arsip },
            isEditing,
            isSaved,
            processing
        } = this.props
        const props = {
            onRemove: file => {
                this.setState(state => {
                    const index = state.fileList.indexOf(file);
                    const newFileList = state.fileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        fileList: newFileList
                    };
                });
            },
            beforeUpload: file => {
                this.setState(state => ({
                    fileList: [file]
                }));
                return false;
            },
            fileList,
        };
        return (
            <PageHeader
                className="site-page-header"
                subTitle={isEditing ? "Entri Baru" : 'Informasi Surat'}
                onBack={isEditing ? undefined : this.resetForm}
                ghost={false}
            >
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
                                        message: 'Mohon pilih tanggal masuk',
                                    },
                                ]}
                                hasFeedback={isEditing}
                                validateStatus={tgl_masuk ? "success" : undefined}
                            >
                                {isEditing ? <DatePicker
                                    disabledDate={(current) => {
                                        return (current.day() === 0 || current.day() === 6 || current.isAfter(moment()))
                                    }}
                                    format="DD MMMM YYYY"
                                    style={{ width: 200 }}
                                    disabled={processing}
                                /> : tgl_masuk ? <strong>{moment(tgl_masuk).format('DD MMMM YYYY')}</strong> : '-'}
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
                                hasFeedback={isEditing}
                                validateStatus={_id ? "success" : undefined}
                            >
                                {isEditing ? <AutoComplete
                                    allowClear
                                    options={autoCompleteDataSource}
                                    onSearch={q => this.handleAutoCSearch(q, '_id')}
                                    style={{ width: "50%" }}
                                    disabled={processing}
                                    onSelect={this.resetSearchResult}
                                >
                                    <Input
                                        ref={this.saveInputRef}
                                        placeholder="Nomor surat"
                                        disabled={processing}
                                        onSelect={this.resetSearchResult}
                                    />
                                </AutoComplete> : <strong>{_id}</strong>}
                            </Form.Item>
                            <Form.Item
                                label="Tanggal Surat"
                                name="tgl_surat"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Mohon pilih tanggal surat',
                                    },
                                ]}
                                hasFeedback={isEditing}
                                validateStatus={tgl_surat ? "success" : undefined}
                            >
                                {isEditing ? <DatePicker
                                    disabledDate={(current) => {
                                        return (
                                            current.day() === 0
                                            || current.day() === 6
                                            || current.isAfter(tgl_masuk)
                                        )
                                    }}
                                    format="DD MMMM YYYY"
                                    style={{ width: 200 }}
                                    disabled={processing || !tgl_masuk}
                                /> : tgl_surat ? <strong>{moment(tgl_surat).format('DD MMMM YYYY')}</strong> : '-'}
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
                                hasFeedback={isEditing}
                                validateStatus={undefined}
                            >
                                {isEditing ? <AutoComplete
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
                                </AutoComplete> : <strong>{perihal}</strong>}
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
                                hasFeedback={isEditing}
                                validateStatus={undefined}
                            >
                                {isEditing ? <AutoComplete
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
                                </AutoComplete> : <strong>{pengirim}</strong>}
                            </Form.Item>
                            <Form.Item
                                label="Arsip"
                                name="arsip"
                                // valuePropName="fileList"
                                // getValueFromEvent={this.normFile}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Mohon pilih file arsip',
                                    },
                                ]}
                                hasFeedback={isEditing}
                                validateStatus={fileList.length ? true : false}
                            >
                                {isEditing ? <Upload {...props}>
                                    <Button disabled={processing} icon={<UploadOutlined />}>Pilih file</Button>
                                </Upload> : fileList.length ? <a href={fileList[0].url} target="_blank">{fileList[0].name}</a> : '-'}
                            </Form.Item>
                            <Form.Item
                                wrapperCol={{
                                    xs: { span: 24, offset: 0 },
                                    sm: { span: 12, offset: 6 },
                                }}
                            >

                                <Space>

                                    <Button
                                        type="primary"
                                        // onClick={this.onClickAmbilNomor}
                                        loading={processing}
                                        disabled={
                                            !(tgl_masuk
                                                && _id
                                                && tgl_surat
                                                && perihal
                                                && pengirim
                                                && (fileList.length)
                                            )
                                            && isEditing
                                        }
                                        onClick={isEditing ? () => this.props.handleSimpan(fileList) : this.props.toggleEditing}
                                    >
                                        {isEditing ? 'Simpan' : 'Edit'}
                                    </Button>
                                    {isSaved ? <Popconfirm
                                        placement="topRight"
                                        title={`Hapus surat ini?`}
                                        okText="Ya"
                                        cancelText="Tidak"
                                        onConfirm={() => this.props.deleteSuratMasuk(_id, this.resetForm)}
                                    >
                                        <Button type="danger">Hapus</Button>
                                    </Popconfirm> : null}
                                </Space>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </PageHeader>
        )
    }
}