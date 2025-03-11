import {Button, Form, Input, Modal, notification} from "antd";
import PropTypes from "prop-types";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {useState} from "react";
import {LockOutlined, PhoneOutlined} from "@ant-design/icons";
import {stripHtmlTags} from "@/utils/helpers.js";
import {ListingService} from "@/services/listing.service.js";

// Quill editöründe kullanılacak toolbar
const modules = {
    toolbar: [
        [{'header': '1'}, {'header': '2'}, {'font': []}],
        [{'list': 'ordered'}, {'list': 'bullet'}],
        ['bold', 'italic', 'underline'],
        ['link'],
        [{'align': []}],
        ['clean']
    ],
};

const ListingModal = (props) => {
    const [description, setDescription] = useState('');

    const onFinish = (values) => {
        if (stripHtmlTags(description).length < 1) {
            notification.error({
                message: 'Açıklama boş olamaz!',
                description: 'Açıklama alanı boş bırakılamaz!',
                placement: 'topRight',
            });
            return;
        }
        if (props.showcaseIndex !== -1) {
            const data = {
                title: values.title,
                description: description,
                phone: values.phone,
                showcaseIndex: props.showcaseIndex
            }
            props.onSubmit(data);
        }
    };

    return (
        <Modal
            title="İlan"
            open={props.open}
            onOk={() => props.form.submit()}
            onCancel={props.onCancel}
            width={780}
            okText="Kaydet"
            cancelText="İptal"
        >
            <Form
                name="listingForm"
                onFinish={onFinish}
                initialValues={{remember: true}}
                layout="vertical"
                style={{textAlign: "left"}}
                form={props.form}
            >
                <Form.Item
                    name="title"
                    label="Başlık"
                    rules={[{required: true, message: "Başlık boş olamaz!"}]}
                >
                    <Input prefix={<LockOutlined/>} placeholder="Başlık"/>
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Açıklama"
                    style={{
                        marginBottom: 60
                    }}
                >
                    <ReactQuill
                        theme="snow"
                        value={description}
                        onChange={setDescription}
                        modules={modules}
                        style={{height: '120px'}}
                    />
                </Form.Item>

                {/* Telefon alanı */}
                <Form.Item
                    name="phone"
                    label="Telefon"
                    rules={[
                        {required: true, message: "Telefon numarası gereklidir!"},
                        { pattern: /^\+\d{1,3}\s?\d{10}$/, message: "Geçersiz telefon numarası! (Ülke kodu ile birlikte giriniz, örn: +90 5551234567)" }
                    ]}
                >
                    <Input
                        prefix={<PhoneOutlined/>}
                        placeholder="Telefon numarası"
                        type="tel"
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

ListingModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    form: PropTypes.object.isRequired,
    showcaseIndex: PropTypes.number.isRequired,
    onSubmit: PropTypes.func.isRequired
};

export default ListingModal;
