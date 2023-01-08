import { Row, Col, Button, Form, Input, Select, AutoComplete, TreeSelect } from 'antd'
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

const all_seksi = [
    { kode: '74041',label:'Subbagian Umum'}, 
    { kode: '74042',label:'Sosial'}, 
    { kode: '74043',label:'Produksi'}, 
    { kode: '74044',label:'Distribusi'}, 
    { kode: '74045',label:'Nerwilis'}, 
    { kode: '74046',label:'IPDS'}, 
    { kode: '74040',label:'BPS Kabupaten Kolaka'},
]
const all_klasifikasi_keamanan = [
    { kode: 'B', label: 'Biasa' },
    { kode: 'T', label: 'Terbatas' },
    { kode: 'R', label: 'Rahasia' },
    { kode: 'SR', label: 'Sangat Rahasia' },
]

const data = require('../klasifikasi_arsip_data')
console.log(data);

const klasifikasi_arsip_data = [
    {
        value: 'PS - PERUMUSAN KEBIJAKAN DI BIDANG STATISTIK MELIPUTI: METODOLOGI DAN INFORMASI STATISTIK, STATISTIK SOSIAL, STATISTIK PRODUKSI, STATISTIK DISTRIBUSI DAN JASA, NERACA DAN ANALISA STATISTIK',
        title: 'PS - PERUMUSAN KEBIJAKAN DI BIDANG STATISTIK MELIPUTI: METODOLOGI DAN INFORMASI STATISTIK, STATISTIK SOSIAL, STATISTIK PRODUKSI, STATISTIK DISTRIBUSI DAN JASA, NERACA DAN ANALISA STATISTIK',
        selectable: false,
        children: [
            {
                value: 'PS.000 - Pengkajian dan Pengusulan Kebijakan',
                title: 'PS.000 - Pengkajian dan Pengusulan Kebijakan'
            },
            {
                value: 'PS.100 - Penyiapan Kebijakan.',
                title: 'PS.100 - Penyiapan Kebijakan.'
            },
            {
                value: 'PS.200 - Masukan dan Dukungan dalam Penyusunan Kebijakan.',
                title: 'PS.200 - Masukan dan Dukungan dalam Penyusunan Kebijakan.'
            },
            {
                value: 'PS.300 - Pengembangan desain dan standardisasi',
                title: 'PS.300 - Pengembangan desain dan standardisasi'
            },
            {
                value: 'PS.400 - Penetapan Norma, Standar, Prosedur dan Kriteria (NSPK)',
                title: 'PS.400 - Penetapan Norma, Standar, Prosedur dan Kriteria (NSPK)'
            },
        ]
    },
    {
        value: 'SS - SENSUS PENDUDUK, SENSUS PERTANIAN DAN SENSUS EKONOMI',
        title: 'SS - SENSUS PENDUDUK, SENSUS PERTANIAN DAN SENSUS EKONOMI',
        selectable: false,
        children: [
            {
                value: 'SS.000 - PERENCANAAN',
                title: 'SS.000 - PERENCANAAN',
                children: [
                    {
                        value: 'SS.010 - Master Plan dan Network planing',
                        title: 'SS.010 - Master Plan dan Network planing'
                    },
                    {
                        value: 'SS.020 - Perumusan dan Penyusunan Bahan',
                        title: 'SS.020 - Perumusan dan Penyusunan Bahan',
                        children: [
                            {
                                value: 'SS.021 - Penyiapan bahan penyusunan rancangan sensus',
                                title: 'SS.021 - Penyiapan bahan penyusunan rancangan sensus'
                            },
                            {
                                value: 'SS.022 - Penyusunan metode pencacahan sensus',
                                title: 'SS.022 - Penyusunan metode pencacahan sensus'
                            },
                            {
                                value: 'SS.023 - Penentuan volume sensus',
                                title: 'SS.023 - Penentuan volume sensus'
                            },
                            {
                                value: 'SS.024 - Penyusunan desain penarikan sampel',
                                title: 'SS.024 - Penyusunan desain penarikan sampel'
                            },
                            {
                                value: 'SS.025 - Penyusunan Kerangka Sampel',
                                title: 'SS.025 - Penyusunan Kerangka Sampel'
                            },
                        ]
                    },
                ]
            },
            {
                value: 'SS.100 - PERSIAPAN SENSUS.',
                title: 'SS.100 - PERSIAPAN SENSUS.'
            },
        ]
    },
]


export default class Editor extends React.Component {
    state = {
        processing: false,
        autoCompleteDataSource: []
    }
    onChangeInput = (changedValues) => {
        this.props.setData(changedValues, 'editing')
    }

    ambilNomor = (data) => {
        this.props.socket.emit('api.master_suratkeluar.editor/simpanSuratKeluar', {...data, pemohon: this.props.pemohon}, (response) => {
            if (response.type === 'OK') {
                this.props.setData({ nomor: response.data.nomor, _id: response.data._id }, 'editing', () => {
                    this.setState({ processing: false })
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

    resetSearchResult = ()=>this.setState({autoCompleteDataSource: []})

    componentDidMount = () => {
        this.input && this.input.focus()
        this.formRef.current && this.formRef.current.setFieldsValue(this.props.data)
    }
    formRef = React.createRef();
    saveInputRef = input => this.input = input
    render() {
        const { tgl_surat, perihal, tujuan, seksi, klasifikasi_keamanan, klasifikasi_arsip } = this.props.data;
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
                            label="Tanggal Surat"
                            name="tgl_surat"
                            // rules={[
                            //     {
                            //         required: true,
                            //         message: 'Mohon pilih tanggal surat',
                            //     },
                            // ]}
                            // hasFeedback
                            // validateStatus={tgl_surat ? "success" : undefined}
                        >
                            {/* <DatePicker
                                disabledDate={(current) => {
                                    return (current.day() === 0 || current.day() === 6 || current.isAfter(moment()))
                                }}
                                format="DD MMMM YYYY"
                                style={{ width: 200 }}
                                disabled={processing}
                            /> */}
                            <strong>{tgl_surat.format('DD/MM/YYYY')}</strong> (hari ini)
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
                            validateStatus={tujuan ? "success" : undefined}
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
                            label="Klasifikasi Keamanan"
                            name="klasifikasi_keamanan"
                            rules={[
                                {
                                    required: true
                                },
                            ]}
                            hasFeedback
                            validateStatus={klasifikasi_keamanan ? "success" : undefined}

                        >
                            <Select style={{ width: 250 }} placeholder="Pilih derajat pengamanan..." disabled={processing}>
                                {all_klasifikasi_keamanan.map(klasifikasi => <Option value={klasifikasi.kode} key={klasifikasi.kode}>{klasifikasi.kode} - {klasifikasi.label}</Option>)}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="Nomor Indeks"
                            name="seksi"
                            rules={[
                                {
                                    required: true
                                },
                            ]}
                            hasFeedback
                            validateStatus={seksi ? "success" : undefined}

                        >
                            <Select style={{ width: 250 }} placeholder="Pilih satuan organisasi..." disabled={processing}>
                                {all_seksi.map(seksi => <Option value={seksi.kode} key={seksi.kode}>{seksi.kode} - {seksi.label}</Option>)}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="Klasifikasi Arsip"
                            name="klasifikasi_arsip"
                            rules={[
                                {
                                    required: true
                                },
                            ]}
                            hasFeedback
                            validateStatus={klasifikasi_arsip ? "success" : undefined}

                        >
                            <TreeSelect
                                showSearch
                                disabled={processing}
                                style={{ width: 500 }}
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                placeholder="Pilih kode klasifikasi..."
                                allowClear
                                treeData={klasifikasi_arsip_data}
                            />
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