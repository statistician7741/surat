import { PageHeader, Row } from "antd"
import dynamic from 'next/dynamic';

const Editor = dynamic(() => import("./Editor"));
const Summary = dynamic(() => import("./Summary"));

export default class Index extends React.Component {
    state = {
        activePage: 'ambil-nomor-baru',
        activeTitle: 'Nomor Surat Baru',
        data: {
            tgl_surat: undefined,
            perihal: undefined,
            tujuan: undefined,
            seksi: undefined
        }
    }

    setData = (data)=>this.setState({data: {...this.state.data, ...data}})

    onSwitchPage = (activePage)=>this.setState({activePage})

    render() {
        const { activePage, activeTitle, data } = this.state;
        return (
            <PageHeader
                className="site-page-header"
                subTitle={activePage === 'ambil-nomor-baru' ? "Nomor Surat" : `${activeTitle}`}
                onBack={activePage === 'ambil-nomor-baru' ? undefined : ()=>this.onSwitchPage('ambil-nomor-baru')}
                ghost={false}
            >
                {activePage === 'ambil-nomor-baru' ?
                    <Editor onSwitchPage={this.onSwitchPage} setData={this.setData} data={data} {...this.props} /> :
                    <Summary  setData={this.setData} data={data} {...this.props} />}
            </PageHeader>
        )
    }
}