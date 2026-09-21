declare global {
    const AppEnv: {
        config: {
            get(key: string): any;
            set(key: string, val: any): void;
            observe(key: string, callback: (val: any) => void): { dispose: () => void };
        };
        [key: string]: any;
    };
}

declare module 'mailspring-exports' {
    export const React: any;
    export const ReactDOM: any;
    export const Actions: any;
    export const DatabaseStore: any;
    export const FocusedPerspectiveStore: any;
    export const MailboxPerspective: any;
    export const MutableQuerySubscription: any;
    export const Thread: any;
    export const ComponentRegistry: any;
    export const WorkspaceStore: any;
    export const PopoverStore: any;
    export const localized: (text: string) => string;
    export const Utils: any;
    export const SheetDepthContext: any;
}

declare module 'mailspring-component-kit' {
    export const RetinaImg: any;
    export const Menu: any;
    export const DropdownMenu: any;
    export const ButtonDropdown: any;
}

export {};
