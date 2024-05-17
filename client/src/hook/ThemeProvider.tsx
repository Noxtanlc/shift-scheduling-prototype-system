import { MantineColorScheme, useMantineColorScheme } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { createContext, useContext, useEffect, useMemo } from "react";

export interface ThemeContextType {
    theme: string | null;
    setTheme: (val: string | ((prevState: string | null) => string | null) | null) => void;
    mantineColor: {
        colorScheme: MantineColorScheme;
        setColorScheme: (value: MantineColorScheme) => void;
        clearColorScheme: () => void;
        toggleColorScheme: () => void;
    };
    ToggleTheme: () => void;
}

const Theme = createContext<ThemeContextType | null>(null)

export default function ThemeProvider({ children }: any) {
    const [theme, setTheme] = useLocalStorage({
        key: 'theme',
        defaultValue: localStorage.getItem('theme'),
    });

    const mantineColor = useMantineColorScheme();

    const ToggleTheme = () => {
        if (!theme) {
            document.documentElement.classList.add("dark");
            mantineColor.setColorScheme('dark');
        } else {
            document.documentElement.classList.remove("dark");
            mantineColor.setColorScheme('light');
        }

        setTheme((current) => (
            !current ? 'dark' : null
        ));
        mantineColor.setColorScheme(theme ? 'dark' : 'light');
    }

    useEffect(() => {
        if (theme) {
            document.documentElement.classList.add("dark");
            mantineColor.setColorScheme('dark');
        } else {
            document.documentElement.classList.remove("dark");
            mantineColor.setColorScheme('light');
        }
    }, [theme])

    const contextValue = useMemo(() => {
        return { theme, setTheme, mantineColor, ToggleTheme }
    }, [theme])

    return (
        <Theme.Provider value={contextValue} >{children}</Theme.Provider>
    )
}

export function useTheme() {
    return useContext(Theme);
}