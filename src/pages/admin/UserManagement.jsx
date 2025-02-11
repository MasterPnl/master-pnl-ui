import AuthHOC from "@/components/hoc/AuthHOC.jsx";
import {Button, Card, Col, Form, Input, Modal, Row, Space, Table} from "antd";
import {useEffect, useState} from "react";
import {UserService} from "@/services/user.service.js";
import {ExclamationCircleFilled} from "@ant-design/icons";


const columns = (
    {
        onClickDelete,
        onClickUpdate
    }) => [
    {
        title: 'Kullanıcı Adı', dataIndex: 'username', key: 'username',
    },
    {
        title: 'İlan Sayısı', dataIndex: 'showcaseCount', key: 'showcaseCount',
    },
    {
        title: 'İşlemler', key: 'action', render: (_, record) => (<Space>
            <Button type="primary" onClick={() => onClickUpdate(record.id)}>Düzenle</Button>
            <Button type="primary" danger onClick={() => onClickDelete(record.id)}>Sil</Button>
        </Space>),
    }
];

const UserManagement = () => {
    const [users, setUsers] = useState([])
    const [showUserForm, setShowUserForm] = useState(false);
    const [form] = Form.useForm();
    const [selectedUser, setSelectedUser] = useState(null)
    const onClickAddUser = () => {
        setSelectedUser(null);
        setShowUserForm(true);
    }

    const showDeleteConfirm = (id) => {
        Modal.confirm({
            title: 'Kullanıcı silinsin mi ?',
            icon: <ExclamationCircleFilled/>,
            okText: 'Sil',
            okType: 'danger',
            cancelText: 'İptal',
            onOk() {
                UserService.delete(id).then(() => {
                    setUsers(users.filter(user => user.id !== id));
                })
            },
        });
    };

    useEffect(() => {
        UserService.getAll().then(response => setUsers(response.data));
    }, []);

    const handleOk = () => {
        form
            .validateFields()
            .then((values) => {
                if (selectedUser) {
                    UserService.update(selectedUser.id, values).then(response => {
                        setUsers(users.map(user => user.id === selectedUser.id ? response.data : user));
                        setShowUserForm(false);
                        form.resetFields();
                    })
                } else {
                    UserService.create(values).then(response => {
                        setUsers([...users, response.data]);
                        setShowUserForm(false);
                        form.resetFields();
                    })
                }
            });
    };

    const handleCancel = () => {
        setShowUserForm(false);
        form.resetFields();
    };

    const onClickUpdate = (id) => {
        setSelectedUser(users.find(user => user.id === id));
        form.setFieldsValue(users.find(user => user.id === id));
        setShowUserForm(true);
    }

    return (<>
        <Modal
            title="Login Form"
            open={showUserForm}
            onOk={handleOk}
            onCancel={handleCancel}
            okText="Submit"
            cancelText="Cancel"
        >
            <Form
                form={form}
                layout="vertical"
                name="loginForm"
                initialValues={{remember: true}}
            >
                <Form.Item
                    name="username"
                    label="Kullanıcı Adı"
                    rules={[
                        {
                            required: true,
                            message: "Kullanıcı adı boş olamaz",
                        },
                    ]}
                >
                    <Input placeholder="Kullanıcı Adı"/>
                </Form.Item>

                <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                        {
                            required: true,
                            message: "Şifre alanı boş olamaz",
                        },
                    ]}
                >
                    <Input.Password placeholder="Şifre"/>
                </Form.Item>
            </Form>
        </Modal>

        <Card title="Kullanıcı Yönetimi">
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Button type="primary" onClick={onClickAddUser}>Yeni Kullanıcı Ekle</Button>
                </Col>
                <Col span={24}>
                    <Card>
                        <Table dataSource={users} columns={columns({
                            onClickDelete: showDeleteConfirm,
                            onClickUpdate: onClickUpdate,
                        })} rowKey={'id'}/>
                    </Card>
                </Col>
            </Row>
        </Card>
    </>);
};

export default AuthHOC(UserManagement);
