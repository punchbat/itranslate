import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Input, Typography, Spin } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { cn } from "@utils";

import { useSignInMutation, SignInput } from "@app/services/auth";
import { useAppDispatch } from "@hooks/index";
import { ToastStore } from "@widgets/index";
import { FailResponse } from "@localtypes";

import "./Page.scss";

const { Title } = Typography;

const b = cn("signin");

const SignIn: FC = function () {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [signIn, { isLoading: isSignInLoading }] = useSignInMutation();

    const onFinish = async (values: SignInput) => {
        try {
            await signIn(values).unwrap();
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

    const handleSignUp = () => {
        navigate("/sign-up");
    };

    if (isSignInLoading) {
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
                        <Title level={1}>Sign-in</Title>
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

                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={isSignInLoading}>
                                    Sign-in
                                </Button>
                                <Button type="link" htmlType="button" onClick={handleSignUp}>
                                    Go to sign-up
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export { SignIn };
