import {Actions, React, ReactDOM} from 'mailspring-exports';
import {Menu, RetinaImg} from 'mailspring-component-kit';
import {CONFIG_KEYS} from './config-keys';

interface State {
    unreadFirst: boolean;
    starredFirst: boolean;
}

const STYLES = `
.sheet-toolbar .btn.btn-toolbar.item-inbox-sort {
    background: transparent !important;
    background-image: none !important;
    box-shadow: none !important;
    border: none !important;
    padding: 0 4px !important;
    margin: 0 !important;
    height: 100% !important;
    opacity: 0.6;
    transition: opacity 200ms;
}
.sheet-toolbar .btn.btn-toolbar.item-inbox-sort:hover {
    opacity: 1 !important;
    background: transparent !important;
}
.inbox-sort-popover .menu {
    overflow: hidden !important;
}
.inbox-sort-popover .content-container {
    overflow: hidden !important;
    overflow-x: hidden !important;
    overflow-y: hidden !important;
}
.inbox-sort-popover .item.checked {
    margin-right: 0 !important;
    padding-right: 28px !important;
}
`;

export default class InboxSortDropdown extends React.Component<{}, State> {

    static displayName = 'InboxSortDropdown';

    private _unreadDisposer: any;
    private _starredDisposer: any;

    constructor(props: {}) {
        super(props);

        this.state = {
            unreadFirst: !!AppEnv.config.get(CONFIG_KEYS.UNREAD_FIRST),
            starredFirst: !!AppEnv.config.get(CONFIG_KEYS.STARRED_FIRST),
        };
    }

    componentDidMount() {
        this._unreadDisposer = AppEnv.config.observe(CONFIG_KEYS.UNREAD_FIRST, (enabled: boolean) => {
            this.setState({unreadFirst: !!enabled});
        });

        this._starredDisposer = AppEnv.config.observe(CONFIG_KEYS.STARRED_FIRST, (enabled: boolean) => {
            this.setState({starredFirst: !!enabled});
        });
    }

    componentWillUnmount() {
        if (this._unreadDisposer?.dispose) {
            this._unreadDisposer.dispose();
        }
        if (this._starredDisposer?.dispose) {
            this._starredDisposer.dispose();
        }

        this._unreadDisposer = null;
        this._starredDisposer = null;
    }

    private _onSelectItem = (item: any) => {
        if (!item) {
            return;
        }

        if (item.id === 'unread') {
            AppEnv.config.set(CONFIG_KEYS.UNREAD_FIRST, !this.state.unreadFirst);
        } else if (item.id === 'starred') {
            AppEnv.config.set(CONFIG_KEYS.STARRED_FIRST, !this.state.starredFirst);
        } else if (item.id === 'default') {
            AppEnv.config.set(CONFIG_KEYS.UNREAD_FIRST, false);
            AppEnv.config.set(CONFIG_KEYS.STARRED_FIRST, false);
        }

        Actions.closePopover();
    };

    private _onToggleDropdown = () => {
        const domNode = ReactDOM.findDOMNode(this) as HTMLElement;
        if (!domNode) {
            return;
        }

        const buttonRect = domNode.getBoundingClientRect();

        const items = [
            {
                id: 'unread',
                name: 'Unread first',
                icon: 'toolbar-markasunread.png',
            },
            {
                id: 'starred',
                name: 'Starred / Flagged first',
                icon: 'toolbar-star-selected.png',
            },
            {
                id: 'default',
                name: 'Default order',
                icon: 'toolbar-markasread.png',
            },
        ];

        Actions.openPopover(
            <div className="inbox-sort-popover" style={{width: 220, minWidth: 220}}>
                <Menu
                    defaultSelectedIndex={-1}
                    items={items}
                    itemKey={(item: any) => item.id}
                    itemChecked={(item: any) => {
                        if (item.id === 'unread') {
                            return this.state.unreadFirst;
                        }
                        if (item.id === 'starred') {
                            return this.state.starredFirst;
                        }
                        if (item.id === 'default') {
                            return !this.state.unreadFirst && !this.state.starredFirst;
                        }
                        return false;
                    }}
                    itemContent={(item: any) => (
                        <span style={{display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap', width: '100%'}}>
                            <RetinaImg
                                name={item.icon}
                                mode={RetinaImg.Mode.ContentIsMask}
                                style={{
                                    marginRight: 10,
                                    width: 16,
                                    height: 16,
                                    backgroundColor: 'currentColor',
                                    flexShrink: 0,
                                }}
                            />
                            <span style={{whiteSpace: 'nowrap'}}>{item.name}</span>
                        </span>
                    )}
                    onSelect={this._onSelectItem}
                    onEscape={() => Actions.closePopover()}
                />
            </div>,
            {
                originRect: buttonRect,
                direction: 'down',
            }
        );
    };

    render() {
        const {unreadFirst, starredFirst} = this.state;

        let title = 'Inbox sorting: Default (date)';
        let iconName = 'toolbar-markasread.png';

        if (unreadFirst && starredFirst) {
            title = 'Inbox sorting: Starred & Unread first';
            iconName = 'toolbar-star-selected.png';
        } else if (starredFirst) {
            title = 'Inbox sorting: Starred first';
            iconName = 'toolbar-star-selected.png';
        } else if (unreadFirst) {
            title = 'Inbox sorting: Unread first';
            iconName = 'toolbar-markasunread.png';
        }

        return (
            <span style={{display: 'inline-flex', alignItems: 'center', order: 100}}>
                <style dangerouslySetInnerHTML={{__html: STYLES}} />
                <button
                    className="btn btn-toolbar item-compose item-inbox-sort"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                    }}
                    title={title}
                    onClick={this._onToggleDropdown}>

                    <RetinaImg
                        name={iconName}
                        mode={RetinaImg.Mode.ContentIsMask}
                    />
                    <RetinaImg
                        name="toolbar-dropdown-chevron.png"
                        mode={RetinaImg.Mode.ContentIsMask}
                        style={{marginLeft: 3}}
                    />
                </button>
            </span>
        );
    }
}

export const UnreadFirstButton = InboxSortDropdown;
