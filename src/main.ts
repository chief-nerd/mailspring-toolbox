import {ComponentRegistry, WorkspaceStore} from "mailspring-exports";
import InboxSortDropdown, {UnreadFirstButton} from "./unread-first-button";
import {CONFIG_KEYS} from "./config-keys";
import {MailboxUtils} from "./mailbox-utils";
import {InboxSortFeature} from "./unread-first-feature";

const mailboxUtils = new MailboxUtils();
const inboxSort = new InboxSortFeature(() => mailboxUtils.refreshCurrentMailbox());

let _unreadDisposer: any = null;
let _starredDisposer: any = null;

function updateSortFeature() {
    const unread = !!AppEnv.config.get(CONFIG_KEYS.UNREAD_FIRST);
    const starred = !!AppEnv.config.get(CONFIG_KEYS.STARRED_FIRST);

    if (unread || starred) {
        inboxSort.enable();
    } else {
        inboxSort.disable();
    }
}

export function activate() {
    ComponentRegistry.register(InboxSortDropdown, {
        location: WorkspaceStore.Location.RootSidebar.Toolbar,
    });

    _unreadDisposer = AppEnv.config.observe(CONFIG_KEYS.UNREAD_FIRST, () => {
        updateSortFeature();
    });

    _starredDisposer = AppEnv.config.observe(CONFIG_KEYS.STARRED_FIRST, () => {
        updateSortFeature();
    });

    updateSortFeature();

    console.log('[mailspring-toolbox] initialized');
}

export function deactivate() {
    if (_unreadDisposer?.dispose) {
        _unreadDisposer.dispose();
    }
    _unreadDisposer = null;

    if (_starredDisposer?.dispose) {
        _starredDisposer.dispose();
    }
    _starredDisposer = null;

    inboxSort.disable();
}

export { InboxSortDropdown, UnreadFirstButton };
