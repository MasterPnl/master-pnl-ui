import { Button, Card, Col, Divider, Flex, Row, Select, Typography } from "antd";
import { useEffect, useState } from "react";
import styles from './admin.module.css';
import classNames from "classnames";
import { ShowcaseService } from "@/services/showcase.service.js";

const MAX_ROW_COUNT = 10;
const DEFAULT_CONFIG = { platinum: 2, gold: 3, silver: 4 };
const SHOWCASE_TYPES = [
    { key: "platinum", columns: 2 },
    { key: "gold", columns: 3 },
    { key: "silver", columns: 4 }
];

const PanelManagement = () => {
    const [rowCount, setRowCount] = useState(null);

    useEffect(() => {
        ShowcaseService.findOne().then(response => {
            setRowCount(response.data || DEFAULT_CONFIG);
        });
    }, []);

    const onClickSaveShowcase = () => {
        ShowcaseService.create(rowCount);
    };

    const onSelectChange = (type, value) => {
        setRowCount(prev => ({ ...prev, [type]: value }));
        console.log(`${type} için seçilen indis numarası: ${value - 1}`);
    };

    const renderSelect = ({ key }) => (
        <Flex key={key} gap="middle" align="center">
            <Typography.Title level={5} style={{ flex: 1 }}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
            </Typography.Title>
            <Select
                defaultValue={rowCount[key]}
                placeholder={`${key} Satır Sayısı`}
                style={{ flex: 1 }}
                options={Array.from({ length: MAX_ROW_COUNT }, (_, i) => ({
                    value: i + 1, label: i + 1
                }))}
                onChange={value => onSelectChange(key, value)}
            />
        </Flex>
    );

    const renderGrid = ({ key, columns }) => (
        <div key={key}>
            <Typography.Title level={5}>{key.charAt(0).toUpperCase() + key.slice(1)}</Typography.Title>
            <div className={styles[`${key}GridContainer`]}>
                {Array.from({ length: rowCount[key] * columns }, (_, index) => (
                    <div key={index} className={classNames(styles.gridCell, styles[`cell${key.charAt(0).toUpperCase() + key.slice(1)}`])} />
                ))}
            </div>
        </div>
    );

    return (
        <Card title="Panel Yönetimi">
            <Row gutter={[16, 16]}>
                {rowCount && (
                    <>
                        <Col span={24}>
                            <Flex vertical gap={16}>
                                {SHOWCASE_TYPES.map(renderSelect)}
                            </Flex>
                        </Col>
                        <Col span={24}>
                            <Button type="primary" onClick={onClickSaveShowcase}>Sütunları Kaydet</Button>
                        </Col>
                        <Divider />
                        <Col span={24}>
                            <div className={styles.gridContainer}>
                                {SHOWCASE_TYPES.map(renderGrid)}
                            </div>
                        </Col>
                    </>
                )}
            </Row>
        </Card>
    );
};

export default PanelManagement;
