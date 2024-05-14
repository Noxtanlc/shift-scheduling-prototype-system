import { CloseButton, TextInput } from "@mantine/core";
import { useMemo } from "react";

const FilterComponent = ({ text, setText, resetPagination }: any) => (
    <>
        <div>
            <TextInput
                placeholder="Search by name"
                value={text}
                onChange={(e: any) => setText(e.currentTarget.value)}
                rightSection={(
                    <CloseButton
                        aria-label="Clear input"
                        onClick={() => {
                            setText('')
                            resetPagination();
                    }}
                        style={{ display: text ? undefined : 'none' }}
                    />
                )}
            />
        </div>
    </>
)

export function nameFilter({ ...props }) {
    const resetPagination = () => {
        if (props.textValue) {
            props.setResetPaginationToggle(!props.resetPaginationToggle)
        }
    }
    return useMemo(() => {
        return (
            <FilterComponent text={props.textValue} setText={props.setText} resetPagination={resetPagination}/>
        );
    }, [props.textValue, props.resetPaginationToggle])
};