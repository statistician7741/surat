import { PageHeader } from "antd"
import dynamic from 'next/dynamic';
import moment from 'moment';
import Router from 'next/router'

const Editor = dynamic(() => import("./Editor"));
const Summary = dynamic(() => import("./Summary"));

export default class Index extends React.Component {

    onSwitchPage = (activePage, cb) => {
        this.setState({ activePage })
    }

    render() {
        const { data } = this.props;
        return (
            <PageHeader
                className="site-page-header"
                subTitle={!data.nomor ? "Nomor Surat Baru" : 'Informasi Nomor'}
                onBack={!data.nomor ? undefined : this.props.resetAmbilNomorBaru}
                ghost={false}
            >
                {!data.nomor ?
                    <Editor onSwitchPage={this.onSwitchPage} {...this.props} />
                    : <Summary {...this.props} />}
            </PageHeader>
        )
    }
}