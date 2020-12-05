import { Col, Collapse, Row, Progress, Select, Typography, Button } from 'antd'
import moment from 'moment';
moment.locale('id');
import columns from './Penilaian.table.columns.component';
const { Option } = Select;

import dynamic from 'next/dynamic';
const TablePenilaian = dynamic(() => import("./Penilaian.table.component"));
import getTambahanKeg from "./Penilaian.function/getTambahanKeg";

export default class Penilaian extends React.Component {
    state = {
        activeKey: undefined,
        month: moment().month(),
        seksi: "--seksi--",
        semua_kegiatan: [],
        semua_tambahan_kegiatan: [],
        semua_organik: [],
        showTambahanPenilaianDrawer: false
    }

    onCloseTambahanDrawer = () => {
        this.setState({
            showTambahanPenilaianDrawer: false,
        });
    };

    

    render() {
        const { activeKey, seksi, month, semua_kegiatan, semua_organik, showTambahanPenilaianDrawer } = this.state;
        const { active_user } = this.props;
        return (
            <React.Fragment>
                <Row style={{ marginBottom: 7 }} gutter={[3, 0]} type="flex" align="middle">
                    <Col xs={3}>
                        <strong>Tunjangan Kinerja:</strong>
                    </Col>
                </Row>
                <Typography style={{ textAlign: "center" }}>
                    <Typography.Title level={4}>Penilaian Tunjangan Kinerja {`${seksi ? (seksi.match(/Tata Usaha/) ? 'Sub Bagian ' : 'Seksi ') : 'Seksi'} ${seksi ? (seksi.match(/Tata Usaha|IPDS/) ? '' : 'Statistik ') : 'Statistik '} ${seksi}`}</Typography.Title>
                </Typography>
                <PenilaianTambahanDrawer
                    showTambahanPenilaianDrawer={showTambahanPenilaianDrawer}
                    onCloseTambahanDrawer={this.onCloseTambahanDrawer}
                    month={month}
                    semua_organik={semua_organik}
                    semua_tambahan_kegiatan={semua_tambahan_kegiatan}
                    seksi={seksi}
                    getOrganik={this.getOrganik}
                    tahun_anggaran={active_user.tahun_anggaran}
                    {...this.props}
                />
            </React.Fragment>
        )
    }
}