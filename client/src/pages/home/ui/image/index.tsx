import { MouseEvent, FC } from "react";
import { useNavigate } from "react-router-dom";

import { cn } from "@utils";
// import { IUser } from "@localtypes";

import "./index.scss";

const b = cn("avatar");

type Props = {
    // _id: string;
    avatar: string;
    gender: string;
};

const TabImage: FC<Props> = ({ avatar, gender }) => {
    const navigate = useNavigate();

    const [translateImage, { isLoading: isTranslateImageLoading }] = useTranslateImageMutation();

    const handleGoToProfile = (e: MouseEvent) => {
        e.stopPropagation();
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, no-underscore-dangle
        navigate(`/profile`);
    };

    return (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
        <div className={b()} onClick={handleGoToProfile}>
            <img
                src={
                    avatar && avatar.length
                        ? `${import.meta.env.VITE_API_URL}/uploads/avatars/${avatar}`
                        : `/assets/user/${gender}.png`
                }
                alt="User avatar"
            />
        </div>
    );
};

export { TabImage };
