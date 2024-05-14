import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";

export default function CustomNotification() {
    const InitialNotification = {
        action: '',
        title: '',
        response: '',
    };

    const [notification, setNotification] = useState<typeof InitialNotification>(InitialNotification);

    useEffect(() => {
        if (notification.title === 'Success') {
            switch (notification.action) {
                case 'Add': {
                    notifications.show({
                        title: <div className="font-bold">{notification.title}</div>,
                        message: <div>Location {notification.response} has been added!</div>,
                        color: "green",
                        onClose: () => setNotification(InitialNotification),
                    });
                    break;
                }
                case 'Edit': {
                    notifications.show({
                        title: <div className="font-bold">Update Succesfully!</div>,
                        message: <div>Location has been updated!</div>,
                        color: "green",
                        onClose: () => setNotification(InitialNotification),
                    });
                    break;
                }
                case 'Delete': {
                    notifications.show({
                        title: <div className="font-bold">{notification.title}</div>,
                        message: <div>Location {notification.response} has been deleted!</div>,
                        color: "green",
                        onClose: () => setNotification(InitialNotification),
                    });
                    break;
                }
            }
        }
        
        if (notification.title === 'Failed') {
            switch (notification.action) {
                case 'Add':
                case 'Edit': {
                    notifications.show({
                        title: <div className="font-bold">{notification.title}</div>,
                        message: <div>Location <span className="font-bold">{notification.response}</span> already existed! Try a different alias OR name...</div>,
                        color: "red",
                        onClose: () => setNotification(InitialNotification),
                    });
                    break;
                }
                case 'Delete': {
                    notifications.show({
                        title: <div className="font-bold">{notification.title}</div>,
                        message: <div>Encountered an error! Try refreshing the page and retry...</div>,
                        color: "red",
                        onClose: () => setNotification(InitialNotification),
                    });
                    break;
                }
            }
        }
    }, [notification]);
}