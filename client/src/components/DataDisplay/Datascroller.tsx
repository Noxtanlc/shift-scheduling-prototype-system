import { ScrollArea, Table } from "@mantine/core";
import { useMemo } from "react";

export function CustomDataScroller({ ...props }) {
    const data: any = props.data;

    const rows = useMemo(() =>
        data ? data.map((ele: any) => (
            <Table.Tr key={ele.id}>
                <Table.Td className="text-center">
                    <div className="px-2 font-bold text-white rounded-xl"
                        style={{
                            backgroundColor: ele['color-coding'],
                            color: ele['color-coding'] === '#ffffff' ? 'black' : undefined
                        }}
                    >
                        {ele.st_alias}
                    </div>
                </Table.Td>
                <Table.Td className="font-semibold">{ele.st_name}</Table.Td>
            </Table.Tr>
        )) : [], [data]);

    return (
        <div className="drop-shadow-lg">
            <ScrollArea h={150}>
                <Table stickyHeader withRowBorders={false} className="text-xs bg-zinc-200/20 dark:bg-zinc-700/20">
                    <Table.Thead className="text-white bg-neutral-600">
                        <Table.Tr>
                            <Table.Th
                                className="text-center"
                                style={{
                                    width: '15%',
                                    minWidth: '100px',
                                }}
                            >
                                Code
                            </Table.Th>
                            <Table.Th>Name</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{rows}</Table.Tbody>
                </Table>
            </ScrollArea>
        </div>
    )
}