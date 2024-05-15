import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Input, Typography, Spin } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { cn } from "@utils";

import { FailResponse } from "@localtypes";
import { SignUpInput, useSignUpMutation } from "@app/services/auth";
import { useAppDispatch } from "@hooks/index";
import { ToastStore } from "@widgets/index";

import "./Page.scss";

const { Title } = Typography;

const b = cn("signin");

const SignUp: FC = function () {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [signUp, { isLoading: isSignUpLoading }] = useSignUpMutation();

    const onFinish = async (values: SignUpInput) => {
        try {
            await signUp(values).unwrap();
            navigate("/");
        } catch (err) {
            const { data } = err as { data: FailResponse };
            dispatch(
                ToastStore.notify({
                    message: data?.message,
                    options: {
                        type: ToastStore.MessageType.ERROR,
                        duration: 3000,
                        position: ToastStore.MessagePositions["RIGHT-TOP"],
                    },
                }),
            );
        }
    };

    const handleBack = () => {
        navigate("/sign-in");
    };

    if (isSignUpLoading) {
        return (
            <div className={b("spin")}>
                <Spin />
            </div>
        );
    }

    return (
        <div className={b()}>
            <div className={b("wrapper")}>
                <div className={b("inner")}>
                    <div className={b("title")}>
                        <Title level={1}>Sign-up</Title>
                    </div>
                    <div className={b("content")}>
                        <Form
                            name="basic"
                            initialValues={{ remember: true }}
                            onFinish={onFinish}
                            layout="vertical"
                            size="large"
                        >
                            <Form.Item
                                name="email"
                                rules={[
                                    {
                                        required: true,
                                        type: "email",
                                        message: "The input is not valid Email!",
                                    },
                                ]}
                            >
                                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                rules={[
                                    { required: true, message: "Please input your password!" },
                                    () => ({
                                        validator(_, value) {
                                            const password = value as string;

                                            const hasUpperCase = /[A-Z]/.test(password);
                                            const hasLowerCase = /[a-z]/.test(password);
                                            const hasNumber = /\d/.test(password);
                                            const hasSymbol = /[!@#$%^&*()_+\-=\\[\]{};':"\\|,.<>\\/?]/.test(password);
                                            const isLengthValid = password.length >= 8;

                                            if (
                                                hasUpperCase &&
                                                hasLowerCase &&
                                                hasNumber &&
                                                hasSymbol &&
                                                isLengthValid
                                            ) {
                                                return Promise.resolve();
                                            }

                                            return Promise.reject(
                                                new Error(
                                                    "The password must contain at least one uppercase letter, one lowercase letter, one digit, one symbol, and be at least 8 characters long!",
                                                ),
                                            );
                                        },
                                    }),
                                ]}
                            >
                                <Input
                                    prefix={<LockOutlined className="site-form-item-icon" />}
                                    type="password"
                                    placeholder="Password"
                                />
                            </Form.Item>
                            <Form.Item
                                name="passwordConfirm"
                                dependencies={["password"]}
                                hasFeedback
                                rules={[
                                    {
                                        required: true,
                                        message: "Please confirm your password!",
                                    },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue("password") === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(
                                                new Error("The new password that you entered do not match!"),
                                            );
                                        },
                                    }),
                                ]}
                            >
                                <Input
                                    prefix={<LockOutlined className="site-form-item-icon" />}
                                    type="password"
                                    placeholder="Confirm Password"
                                />
                            </Form.Item>
                            <Form.Item name="name" rules={[{ required: true, message: "Please enter your name!" }]}>
                                <Input placeholder="Name" />
                            </Form.Item>
                            <Form.Item
                                name="surname"
                                rules={[{ required: true, message: "Please enter your surname!" }]}
                            >
                                <Input placeholder="Surname" />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={isSignUpLoading}>
                                    Sign-up
                                </Button>
                                <Button type="link" onClick={handleBack}>
                                    Back to sign-in
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export { SignUp };
