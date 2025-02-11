import {Button, Card, Col, Modal, Row, Select, Typography} from "antd";
import {useEffect, useState} from "react";
import styles from './admin.module.css';
import classNames from "classnames";
import {ShowcaseService} from "@/services/showcase.service.js";
import {UserService} from "@/services/user.service.js";
import {UserShowcaseService} from "@/services/userShowcase.service.js";
import {ExclamationCircleFilled} from "@ant-design/icons";

const DEFAULT_CONFIG = {platinum: 0, gold: 0, silver: 0};

const SHOWCASE_TYPES = [{key: "platinum", rows: 2}, {key: "gold", rows: 3}, {key: "silver", rows: 5}];

const UserPanelManagement = () => {
    const [columnCount, setColumnCount] = useState(DEFAULT_CONFIG);
    const [users, setUsers] = useState([]);
    const [userSelectValues, setUserSelectValues] = useState([])
    const [showCaseUsers, setShowCaseUsers] = useState([])

    useEffect(() => {
        ShowcaseService.findOne().then(response => {
            setColumnCount(response.data || DEFAULT_CONFIG);
        });

        UserService.getAll().then(response => setUsers(response.data.map(user => ({
            label: user.username, value: user.id,
        }))));

        UserShowcaseService.getAll().then(response => {
            setShowCaseUsers(response.data);
        });
    }, []);

    useEffect(() => {
        if (users.length && showCaseUsers.length) {
            const totalCell = SHOWCASE_TYPES.reduce((acc, {key, rows}) => acc + columnCount[key] * rows, 0);
            let _userSelectValues = [];
            for (let i = 0; i < totalCell; i++) {
                const showcaseIndex = i + 1;
                const user = users.find(user => user.value === showCaseUsers.find(item => item.showcaseIndex === showcaseIndex)?.userId);
                _userSelectValues.push({
                    showcaseIndex, userId: user?.value
                });
            }
            setUserSelectValues(_userSelectValues);
        }
    }, [columnCount, users, showCaseUsers]);

    const onChangeUser = ({userId, showcaseIndex}) => {
        UserShowcaseService.create({
            userId, showcaseIndex
        }).then(response => {
            let _userSelectValues = userSelectValues.map(item => {
                if (item.showcaseIndex === response.data.showcaseIndex) {
                    return {
                        ...item, userId
                    };
                }
                return item;
            });
            setUserSelectValues(_userSelectValues)
        })
    };

    const showDeleteConfirm = (showcaseIndex) => {
        Modal.confirm({
            title: 'Silinsin mi ?',
            icon: <ExclamationCircleFilled/>,
            okText: 'Sil',
            okType: 'danger',
            cancelText: 'İptal',
            onOk() {
                UserShowcaseService.delete(showcaseIndex).then(() => {
                    setUserSelectValues(userSelectValues.map(item => {
                        if (item.showcaseIndex === showcaseIndex) {
                            return {
                                ...item, userId: null
                            };
                        }
                        return item;
                    }))
                })
            },
        });
    };

    const renderGrid = (type, columns, rows, startIndex) => (<div className={styles[`${type}GridContainer`]}>
        {Array.from({length: columns * rows}, (_, index) => {
            const globalIndex = startIndex + index + 1;
            return (
                <div
                    key={globalIndex}
                    className={classNames(styles.gridCell, styles[`cell${type.charAt(0).toUpperCase() + type.slice(1)}`], styles.userGridContainer)}>
                    <span className={styles.cellIndex}>{globalIndex}</span>
                    <Select
                        className={styles.userSelect}
                        placeholder="Kullanıcı Ata"
                        options={users}
                        value={userSelectValues.find(item => item.showcaseIndex === globalIndex)?.userId}
                        onChange={(value) => onChangeUser({
                            userId: value, showcaseIndex: globalIndex
                        })}
                    />
                    <Button
                        type="primary"
                        danger
                        disabled={!userSelectValues.find(item => item.showcaseIndex === globalIndex)?.userId}
                        onClick={() => showDeleteConfirm(userSelectValues.find(item => item.showcaseIndex === globalIndex)?.showcaseIndex)}
                    >
                        Sil
                    </Button>
                </div>);
        })}
    </div>);

    let startIndex = 0;

    return (<Card title="Kullanıcı Panel Yönetimi">
        {columnCount && (<Row gutter={[16, 16]}>
            <Col span={24}>
                <div className={styles.gridContainer}>
                    {SHOWCASE_TYPES.map(({key, rows}) => {
                        const columns = columnCount[key];
                        const gridComponent = renderGrid(key, columns, rows, startIndex);
                        startIndex += columns * rows;
                        return (<div key={key}>
                            <Typography.Title level={5}>
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                            </Typography.Title>
                            {gridComponent}
                        </div>);
                    })}
                </div>
            </Col>
        </Row>)}
    </Card>);
};

export default UserPanelManagement;
