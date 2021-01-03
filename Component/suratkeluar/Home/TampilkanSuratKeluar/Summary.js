import { Row, Col, Typography, Upload, Button, Form, Input, Select, DatePicker, Space, Popconfirm, AutoComplete, Divider } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import axios from 'axios'
import moment from 'moment'
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

const all_seksi = ['Subbagian Umum', 'Sosial', 'Produksi', 'Distribusi', 'Nerwilis', 'IPDS', 'Tidak ada']

export default class Editor extends React.Component {
    state = {
        fileList: [],
        uploading: false,
        autoCompleteDataSource: [],
        arsipUploaded: false,
        processing: false
    }

    onChangeInput = (changedValues) => this.props.setData(changedValues, 'editing')

    handleUpload = () => {
        const { fileList, arsipUploaded } = this.state;
        if (fileList.length === 0) {
            this.props.showErrorMessage('Mohon pilih file terlebih dahulu')
            return
        } else if (arsipUploaded) {
            this.props.showErrorMessage('Arsip sudah terupload sebelumnya')
            return
        }
        const formData = new FormData();
        const name = fileList[0].name;
        fileList.forEach(file => {
            formData.append('files[]', file);
        });
        formData.append('_id', this.props.data._id);
        this.setState({
            uploading: true,
        }, () => {
            axios.post('/suratkeluar/arsip/upload', formData)
                .then((response) => {
                    if (response.data === 'OK') {
                        this.setState({
                            uploading: false, arsipUploaded: true, fileList: [{
                                uid: 1,
                                name,
                                status: 'done',
                                url: `/arsip/download/${this.props.data._id}_${name}`
                            }]
                        }, () => {
                            this.props.showSuccessMessage('Berhasil diupload')
                            this.props.getListSuratKeluar()
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

    resetSearchResult = () => this.setState({ autoCompleteDataSource: [] })

    simpan = (data) => {
        this.props.socket.emit('api.master_suratkeluar.editor/simpanSuratKeluar', data, (response) => {
            if (response.type === 'OK') {
                this.props.toggleEditing(undefined, true, () => {
                    this.setState({processing: false})
                    this.props.showSuccessMessage("Berhasil diupdate")
                    this.props.getListSuratKeluar()
                })
            } else {
                this.props.showErrorMessage(response.message)
            }
        })
    }

    onRemoveFileUploaded = (filename, cb) => {
        this.props.socket.emit('api.master_suratkeluar.editor/removeFileUploaded', filename, (response) => {
            if (response.type === 'OK') {
                this.props.showSuccessMessage("Arsip berhasil dihapus")
            }
            cb()
        })
    }

    onClickSimpan = () => {
        this.setState({ processing: true }, () => this.simpan(this.props.data))
    }

    getData = (propsData) => ({
        nomor: propsData.nomor,
        tgl_surat: propsData.tgl_surat,
        perihal: propsData.perihal,
        tujuan: propsData.tujuan,
        seksi: propsData.seksi
    })

    setArsip = () => {
        if (!this.props.data.arsip) {
            const fileList = this.props.data.arsip_filename ? [{
                uid: 1,
                name: this.props.data.arsip_filename,
                status: 'done',
                url: `/arsip/download/${this.props.data.arsip_filename}`
            }] : []
            this.setState({ fileList })
        }
    }

    componentDidMount = () => {
        this.setArsip();
        this.formRef.current && this.formRef.current.setFieldsValue(this.getData(this.props.data))
        this.props.getListSuratKeluar();
    }

    componentDidUpdate = (prevProps) => {
        if (prevProps.data !== this.props.data) {
            this.setArsip();
            this.formRef.current && this.formRef.current.setFieldsValue(this.getData(this.props.data))
        }
    }

    formRef = React.createRef();
    saveInputRef = input => this.input = input
    render() {
        const { uploading, fileList, processing } = this.state;
        const { _id, tgl_surat, nomor, perihal, tujuan, seksi } = this.props.data;
        const { isEditing, minDate, maxDate } = this.props
        const { autoCompleteDataSource } = this.state;
        const nomor_surat = `B-${nomor<10?'0'+nomor:nomor}/74041/${tgl_surat.format('MM')}/${tgl_surat.format('YYYY')}`
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
                                {!isEditing ?
                                    <>
                                        <span style={{ fontSize: 40 }}>{nomor_surat}</span><Text copyable={{ text: nomor_surat, tooltips: ['Copy?', 'Tercopy!'] }}></Text>
                                    </>
                                    : <span>(mohon klik Simpan untuk melihat)</span>}

                            </Form.Item>
                            <Form.Item
                                label="Arsip"
                                name="arsip"
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
                                    // disabled={fileList.length === 0}
                                    loading={uploading}
                                >
                                    {uploading ? 'Uploading...' : 'Upload arsip'}
                                </Button>
                            </Form.Item>
                            <Divider plain>Detail Surat Keluar</Divider>
                            <Form.Item
                                label="Tanggal Surat"
                                name="tgl_surat"
                                rules={[
                                    {
                                        required: isEditing,
                                        message: 'Mohon isi tanggal surat',
                                    },
                                ]}
                                hasFeedback={isEditing}
                                validateStatus={tgl_surat ? "success" : undefined}
                            >
                                <DatePicker
                                    disabledDate={(current) => {
                                        return (minDate ? current.isBefore(moment(minDate).startOf('day')) : false)
                                            || (maxDate ? current.isAfter(moment(maxDate).endOf('day')) : false)
                                    }}
                                    format="DD MMMM YYYY"
                                    style={{ width: 200 }}
                                    disabled={!isEditing}
                                />
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
                                    onSelect={this.resetSearchResult}
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
                                    onSelect={this.resetSearchResult}
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
                                        required: isEditing,
                                        message: 'Mohon pilih seksi',
                                    },
                                ]}
                                hasFeedback={isEditing}
                                validateStatus={seksi ? "success" : undefined}
                            >
                                <Select placeholder="Pilih seksi" style={{ width: 200 }} disabled={!isEditing}>
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
                                    <Button type="primary" onClick={isEditing ? this.onClickSimpan : () => this.props.toggleEditing(_id, false, this.input.focus)} disabled={isEditing && (!tgl_surat || !perihal || !tujuan || !seksi)} loading={processing}>{isEditing ? 'Simpan' : 'Edit'}</Button>
                                    <Popconfirm placement="topRight" title={`Hapus nomor surat ini?`} okText="Ya" cancelText="Tidak" onConfirm={() => this.props.deleteSuratKeluar(_id, this.props.resetAmbilNomorBaru)}>
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