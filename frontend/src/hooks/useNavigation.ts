import { useState } from 'react';

export interface NavigationItem {
    type: 'link' | 'dropdown' | 'subheading';
    label: string;
    icon?: string;
    route?: string;
    children?: NavigationItem[];
    badge?: {
        value: string;
        bgClass: string;
        textClass: string;
    };
}

interface UseNavigationReturn {
    items: NavigationItem[];
    openDropdowns: Set<string>;
    toggleDropdown: (label: string) => void;
    isDropdownOpen: (label: string) => boolean;
}

export function useNavigation(): UseNavigationReturn {
    const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(new Set());

    const items: NavigationItem[] = [
        {
            type: 'subheading',
            label: 'Principal',
            children: [
                {
                    type: 'link',
                    label: 'Dashboard',
                    icon: 'fas fa-home',
                    route: '/home',
                },
            ],
        },
        {
            type: 'subheading',
            label: 'Gestión',
            children: [
                {
                    type: 'link',
                    label: 'Casos',
                    icon: 'fas fa-folder-open',
                    route: '/casos',
                },
                {
                    type: 'link',
                    label: 'Fiscales',
                    icon: 'fas fa-user-tie',
                    route: '/fiscales',
                },
                {
                    type: 'link',
                    label: 'Fiscalías',
                    icon: 'fas fa-building',
                    route: '/fiscalias',
                },
            ],
        },
        {
            type: 'subheading',
            label: 'Auditoría',
            children: [
                {
                    type: 'link',
                    label: 'Bitácora de Casos',
                    icon: 'fas fa-book',
                    route: '/bitacoras',
                },
                {
                    type: 'link',
                    label: 'Logs de Reasignación',
                    icon: 'fas fa-exclamation-triangle',
                    route: '/logs-reasignacion',
                },
            ],
        },
        {
            type: 'subheading',
            label: 'Reportes',
            children: [
                {
                    type: 'link',
                    label: 'Reportes Generales',
                    icon: 'fas fa-chart-bar',
                    route: '/reportes',
                },
            ],
        },
    ];

    const toggleDropdown = (label: string) => {
        setOpenDropdowns((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(label)) {
                newSet.delete(label);
            } else {
                newSet.add(label);
            }
            return newSet;
        });
    };

    const isDropdownOpen = (label: string): boolean => {
        return openDropdowns.has(label);
    };

    return {
        items,
        openDropdowns,
        toggleDropdown,
        isDropdownOpen,
    };
}

