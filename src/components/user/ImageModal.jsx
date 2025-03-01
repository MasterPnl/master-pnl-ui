import {Button, Flex, Image, Modal, notification, Space, Typography, Upload} from "antd";
import PropTypes from "prop-types";
import 'react-quill/dist/quill.snow.css';
import {UploadOutlined} from "@ant-design/icons";
import {BASE_URL} from "@/services/axiosInstance.js";
import {useEffect, useState} from "react";
import {ListingService} from "@/services/listing.service.js";

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

const ListingImageModal = (props) => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        if (!props.open && props.showcaseIndex === -1) return;
        ListingService.images(props.showcaseIndex).then(response => {
            const images = response.data.map(image => {
                return {
                    uid: image.id,
                    name: image.path,
                    status: 'done',
                    url: `${BASE_URL}/images/${image.path}`,
                }
            });
            setFileList(images);
        })
    }, [props.open, props.showcaseIndex])

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };

    const uploadProps = {
        name: 'image',
        listType: "picture",
        action: `${BASE_URL}/listing/${props.showcaseIndex}/image`,
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        accept: 'image/jpeg, image/png, image/gif',
        fileList: fileList,
        onPreview: handlePreview,
        onSuccess: async (response) => {
            notification.destroy();
            notification.success({
                message: 'Görsel başarıyla yüklendi!',
            });
            const image = {
                uid: response.id,
                name: response.path,
                status: 'done',
                url: `${BASE_URL}/images/${response.path}`,
            }
            setFileList([...fileList, image]);
        },
        onRemove: async (file) => {
            try {
                await ListingService.deleteImage(file.uid)
                setFileList(fileList.filter(item => item.uid !== file.uid));
            } catch (error) {
                console.log(error)
                return false;
            }
        },
        onError: () => {
            notification.destroy();
            if(fileList.length === 3){
                notification.error({
                    message: 'İlanın en fazla 3 resmi yüklenebilir!',
                });
            }
        }
    };

    return (
        <Modal
            title="İlan Görselleri"
            onCancel={props.onCancel}
            width={780}
            cancelText="İptal"
            open={props.open}
            okButtonProps={{style: {display: 'none'}}}
        >

            <Upload {...uploadProps}>
                <Flex justify="center">
                    <Button type="primary" icon={<UploadOutlined/>}>
                        Görsel Yükle
                    </Button>
                </Flex>
            </Upload>
            {previewImage && (
                <Image
                    wrapperStyle={{display: 'none'}}
                    preview={{
                        visible: previewOpen,
                        onVisibleChange: (visible) => setPreviewOpen(visible),
                        afterOpenChange: (visible) => !visible && setPreviewImage(''),
                    }}
                    src={previewImage}
                />
            )}
            {fileList.length === 0 && <Flex justify="center">
                <Space>
                    <Typography.Title level={5}>İlanın herhangi bir resmi yok</Typography.Title>
                </Space>
            </Flex>}
        </Modal>
    );
};

ListingImageModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    showcaseIndex: PropTypes.number.isRequired,
};

export default ListingImageModal;
