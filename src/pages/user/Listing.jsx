import {Button, Card, Col, Form, Modal, notification, Row, Typography} from "antd";
import {useCallback, useEffect, useState} from "react";
import styles from './listing.module.css';
import classNames from "classnames";
import {ShowcaseService} from "@/services/showcase.service.js";
import {ListingService} from "@/services/listing.service.js";
import ListingModal from "@/components/user/ListingModal.jsx";
import {ExclamationCircleFilled} from "@ant-design/icons";
import ListingImageModal from "@/components/user/ImageModal.jsx";

const DEFAULT_CONFIG = {platinum: 0, gold: 0, silver: 0};
const SHOWCASE_TYPES = [{key: "platinum", rows: 2}, {key: "gold", rows: 3}, {key: "silver", rows: 5}];

const Listing = () => {
    const [columnCount, setColumnCount] = useState(DEFAULT_CONFIG);
    const [userShowcase, setUserShowcase] = useState(false);
    const [userListing, setUserListing] = useState([])
    const [listingModalOpen, setListingModalOpen] = useState(false);
    const [imageModalOpen, setImageModalOpen] = useState(false);
    const [selectedShowcaseIndex, setSelectedShowcaseIndex] = useState(-1);
    const [selectedImageIndex, setSelectedImageIndex] = useState(-1);
    const [form] = Form.useForm();

    useEffect(() => {
        ShowcaseService.findOne().then(response => {
            setColumnCount(response.data || DEFAULT_CONFIG);
        });

        ListingService.getAll().then(response => {
            setUserShowcase(response.data.userShowcase);
            setUserListing(response.data.listings);
        })
    }, []);

    useEffect(() => {
        if (selectedShowcaseIndex !== -1) {
            setListingModalOpen(true);
            if(isExisting(selectedShowcaseIndex)){
                const listing = userListing.find(val => val.showcaseIndex === selectedShowcaseIndex);
                form.setFieldsValue(listing);
            }
        } else {
            setListingModalOpen(false);
        }
    }, [selectedShowcaseIndex]);

    useEffect(() => {
        if (selectedImageIndex !== -1) {
            setImageModalOpen(true);
        } else {
            setImageModalOpen(false);
        }
    }, [selectedImageIndex]);

    // helper functions
    const isOwner = useCallback((index) => {
        return userShowcase.map(val => val.showcaseIndex).includes(index);
    }, [userShowcase]);

    const isExisting = useCallback((index) => {
        return userListing.map(val => val.showcaseIndex).includes(index);
    }, [userListing]);

    const renderGrid = (type, columns, rows, startIndex) => (<div className={styles[`${type}GridContainer`]}>
        {Array.from({length: columns * rows}, (_, index) => {
            const globalIndex = startIndex + index + 1;
            return (
                <div
                    key={globalIndex}
                    className={classNames(styles.gridCell, styles[`cell${type.charAt(0).toUpperCase() + type.slice(1)}`], {[styles.disabledCell]: !isOwner(globalIndex)})}>
                    {!isOwner(globalIndex) && <span className={styles.notOwnerCell}>Bu ilan size ait değil</span>}
                    {isOwner(globalIndex) && (
                        <div className={styles.listingButtons}>
                            <span
                                style={{
                                    color: isExisting(globalIndex) ? "#1B5E20" : "#1b265e",
                                }}
                            >{
                                isExisting(globalIndex) ?
                                    `Başlık : ${userListing.find(val => val.showcaseIndex === globalIndex).title}` :
                                    "İlan ekle"
                            }</span>
                            <Button
                                type="primary"
                                onClick={() => onClickListingEdit(globalIndex)}>
                                İlan Detayları Düzenle
                            </Button>
                            <Button
                                color="default"
                                variant="outlined"
                                onClick={() => onClickListingImage(globalIndex)}>İlan Görsellerini Düzenle
                            </Button>
                            <Button
                                type="primary"
                                disabled={!isExisting(globalIndex)}
                                danger
                                onClick={() => onClickListingDelete(globalIndex)}>Sil
                            </Button>
                        </div>
                    )}
                </div>);
        })}
    </div>);

    // listing modal functions
    const onClickListingEdit = (showcaseIndex) => {
        setSelectedShowcaseIndex(showcaseIndex);
        form.resetFields();
    }

    const onCloseListingModal = () => {
        setSelectedShowcaseIndex(-1);
    }

    const onSubmitModal = (data) => {
        if(isExisting(selectedShowcaseIndex)){
            ListingService.update(selectedShowcaseIndex, data).then(() => {
                notification.success({
                    message: 'İlan başarıyla güncellendi!',
                    description: 'İlan başarıyla güncellendi!',
                    placement: 'topRight',
                });
                setUserListing(userListing.map(val => val.showcaseIndex === selectedShowcaseIndex ? data : val));
                onCloseListingModal();
            })
        } else {
            ListingService.create(data).then(() => {
                notification.success({
                    message: 'İlan başarıyla oluşturuldu!',
                    description: 'İlan başarıyla oluşturuldu!',
                    placement: 'topRight',
                });
                setUserListing([...userListing, data]);
                onCloseListingModal();
            })
        }
    };

    // delete modal functions
    const onClickListingDelete = (showcaseIndex) => {
        Modal.confirm({
            title: 'İlan silinsin mi ?',
            icon: <ExclamationCircleFilled/>,
            okText: 'Sil',
            okType: 'danger',
            cancelText: 'İptal',
            onOk() {
                ListingService.delete(showcaseIndex).then(() => {
                    setUserListing(userListing.filter(val => val.showcaseIndex !== showcaseIndex));
                });
            },
        })
    }


    // image modal functions
    const onClickListingImage = (showcaseIndex) => {
        setSelectedImageIndex(showcaseIndex);
    }

    const onCloseImageModal = () => {
        setSelectedImageIndex(-1);
    }

    let startIndex = 0;

    if (userShowcase === false) return null;

    return (
        <>
            <ListingModal
                open={listingModalOpen}
                form={form}
                onCancel={onCloseListingModal}
                showcaseIndex={selectedShowcaseIndex}
                onSubmit={onSubmitModal}
            />
            <ListingImageModal
                open={imageModalOpen}
                onCancel={onCloseImageModal}
                showcaseIndex={selectedImageIndex}
            />
            <Card title="İlan Yönetimi">
                <Row>
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
                </Row>
            </Card>
        </>
    )
};

export default Listing;