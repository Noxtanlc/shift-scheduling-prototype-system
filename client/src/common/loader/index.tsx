import { Loader } from '@mantine/core';

export default function rootLoader() {
    return (
        <div className="flex h-screen items-center justify-center">
            <Loader size={'xl'} />
        </div>
    );
};