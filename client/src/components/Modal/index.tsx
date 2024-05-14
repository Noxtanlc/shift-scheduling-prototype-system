import { Modal as MantineModal } from "@mantine/core";
import { ReactNode } from "react";

export default function Modal({ ...props }) {
    const action = props.action;
    const body = () => {
        if (props.body) {
            return props.body;
        } else if (props.Form) {
            return props.Form;
        } else {
            return <></>;
        }
    };

    const title = props.title;
    let headerColor = '';
    var size = undefined;

    if (props.Form['props'] !== undefined) {
        if (props.Form['props'].id === 'schedule') {
            size = 'auto';
        }
    }

    switch (action) {
        case 'Add': {
            headerColor = "#0284c7";
            break;
        }
        case 'Edit': {
            headerColor = "#ca8a04"
            break;
        }
        default: {
            headerColor = "#0284c7";
            break;
        }
    }

    return (
        <>
            <MantineModal
                size={size}
                styles={{
                    header: {
                        backgroundColor: headerColor,
                    },
                }}
                opened={props.opened}
                onClose={() => props.handler.close()}
                title={(
                    <>
                        <div className="font-bold text-lg text-white">
                            {title}
                        </div>
                    </>
                )}
                children={body()}
                {...props.modalProps}
            />
        </>
    )
}

/*
export function groupModal({ ...props }) {
    const data = props.data;
    const action = props.action;
    let title = '';
    let groupID = 0;
    let groupName = '';
    let staff = [];
    let selectedStaff: any = [];
    let staffSelection: any = [];
    props.staffList.map((ele: any) => {
        staffSelection.push({
            value: ele['staff_id'].toString(),
            label: ele['name'],
        })
    });

    switch (action) {
        case 'Add': {
            title = "Add New Group";
            break;
        }
        case 'Edit': {
            title = "Edit Group";
            if (data != undefined) {
                groupID = data['groupID'];
                groupName = data['groupName'];
                staff = data['staff'];

                if (staff !== undefined) {
                    staff.map((ele: any) => {
                        selectedStaff.push(
                            ele['staffID'].toString(),
                        );
                    });
                }
            }
            break;
        }
    }

    return (
        <>
            <MantineModal
                opened={props.opened}
                onClose={() => props.handler.close()}
                title={title}
                centered
            >
                <GroupForm
                    groupID={groupID}
                    staffList={staffSelection}
                    groupName={groupName}
                    staffValues={selectedStaff}
                    action={action}
                    handler={props.handler}
                    updates={props.updates}
                    setUpdate={props.setUpdates}
                    setNotification={props.setNotification}
                />
            </MantineModal>
        </>
    )

}
*/