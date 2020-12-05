import { Col, Collapse, Row, Progress, Select, Typography, Button } from 'antd'
import moment from 'moment';
moment.locale('id');
const { Option } = Select;

import dynamic from 'next/dynamic';

export default class Penilaian extends React.Component {
    state = {
        activeKey: undefined,
    }    

    render() {
        return (
            <React.Fragment>
                Hello world!
            </React.Fragment>
        )
    }
}