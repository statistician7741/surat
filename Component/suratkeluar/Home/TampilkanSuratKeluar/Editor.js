import { Row, Col, Button, Form, Input, Select, DatePicker } from 'antd'
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

    }
    onChangeInput = (changedValues) => {
        this.props.setData(changedValues)
    }

    onClickAmbilNomor = (data)=>{
        this.props.socket.emit('api.master_suratkeluar.editor/simpanSuratKeluar', data, (response) => {
            if (response.type === 'ok') {
              console.log(response);
            } else {
              this.props.showErrorMessage(response.data)
            }
          })
    }

    componentDidMount = () => {
        this.formRef.current && this.formRef.current.setFieldsValue(this.props.data)
    }
    formRef = React.createRef();
    render() {
        const { onSwitchPage, data } = this.props;
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
                            validateStatus={data.tgl_surat?"success":undefined}
                        >
                            <DatePicker format="DD MMMM YYYY" style={{ width: 200 }} />
                        </Form.Item>
                        <Form.Item
                            label="Perihal"
                            name="perihal"
                            rules={[
                                {
                                    required: true,
                                    message: 'Mohon isi perihal surat Anda.',
                                },
                            ]}
                            hasFeedback
                            validateStatus={data.perihal?"success":undefined}
                        >
                            <TextArea
                                placeholder="Perihal..."
                                style={{ height: 50 }}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Tujuan"
                            name="tujuan"
                            rules={[
                                {
                                    required: true,
                                    message: 'Mohon isi tujuan surat Anda.',
                                },
                            ]}
                            hasFeedback
                            validateStatus={data.tujuan?"success":undefined}
                        >
                            <TextArea
                                placeholder="Tujuan surat..."
                                style={{ height: 50 }}
                            />
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
                            validateStatus={data.seksi?"success":undefined}

                        >
                            <Select style={{ width: 200 }}>
                                {all_seksi.map(seksi => <Option value={seksi} key={seksi}>{seksi}</Option>)}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            wrapperCol={{
                                xs: { span: 24, offset: 0 },
                                sm: { span: 12, offset: 6 },
                            }}
                        >
                            <Button type="primary" onClick = {()=>this.onClickAmbilNomor(data)}>Ambil Nomor Baru</Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        )
    }
}