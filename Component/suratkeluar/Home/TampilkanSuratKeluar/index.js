import { PageHeader, Row } from "antd"
import dynamic from 'next/dynamic';
import moment from 'moment';

const Editor = dynamic(() => import("./Editor"));
const Summary = dynamic(() => import("./Summary"));

export default class Index extends React.Component {
    state = {
        activePage: 'ambil-nomor-baru',
        activeTitle: 'Nomor Surat Baru',
        data: {
            nomor: undefined,
            tgl_surat: moment(),
            perihal: undefined,
            tujuan: undefined,
            seksi: undefined
        }
    }

    setData = (data, cb)=>this.setState({data: {...this.state.data, ...data}}, cb)

    onSwitchPage = (activePage)=>this.setState({activePage})

    render() {
        const { activePage, activeTitle, data } = this.state;
        const { _id } = this.props;
        return (
            <PageHeader
                className="site-page-header"
                subTitle={activePage === 'ambil-nomor-baru' ? "Nomor Surat" : `${activeTitle}`}
                onBack={activePage === 'ambil-nomor-baru' ? undefined : ()=>{ this.setState({data: {tgl_surat: moment()}}, ()=>this.onSwitchPage('ambil-nomor-baru')) }}
                ghost={false}
            >
                {activePage === 'ambil-nomor-baru' && !_id ?
                    <Editor onSwitchPage={this.onSwitchPage} setData={this.setData} data={data} {...this.props} /> :
                    <Summary  setData={this.setData} data={data} {...this.props} />}
            </PageHeader>
        )
    }
}