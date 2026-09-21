/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/config-keys.ts"
/*!****************************!*\
  !*** ./src/config-keys.ts ***!
  \****************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CONFIG_KEYS = void 0;
exports.CONFIG_KEYS = {
    UNREAD_FIRST: "mailspring-toolbox.unreadFirstEnabled",
    STARRED_FIRST: "mailspring-toolbox.starredFirstEnabled",
};


/***/ },

/***/ "./src/mailbox-utils.ts"
/*!******************************!*\
  !*** ./src/mailbox-utils.ts ***!
  \******************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MailboxUtils = void 0;
const { Actions, FocusedPerspectiveStore, MailboxPerspective } = __webpack_require__(/*! mailspring-exports */ "mailspring-exports");
class MailboxUtils {
    constructor() {
        this._refreshing = false;
    }
    refreshCurrentMailbox() {
        if (this._refreshing) {
            return;
        }
        const currentMailbox = FocusedPerspectiveStore.current();
        if (!currentMailbox) {
            return;
        }
        this._refreshing = true;
        // to force refresh it is required to bypass the check <current> equals <new> perspective
        // for this reason those should not be equal, thus setting empty perspective first
        Actions.focusMailboxPerspective(MailboxPerspective.forNothing());
        // running as a task to give UI enough time to re-render
        setTimeout(() => {
            Actions.focusMailboxPerspective(currentMailbox);
            this._refreshing = false;
        }, 0);
    }
}
exports.MailboxUtils = MailboxUtils;


/***/ },

/***/ "./src/main.ts"
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UnreadFirstButton = exports.InboxSortDropdown = void 0;
exports.activate = activate;
exports.deactivate = deactivate;
const mailspring_exports_1 = __webpack_require__(/*! mailspring-exports */ "mailspring-exports");
const unread_first_button_1 = __importStar(__webpack_require__(/*! ./unread-first-button */ "./src/unread-first-button.tsx"));
exports.InboxSortDropdown = unread_first_button_1.default;
Object.defineProperty(exports, "UnreadFirstButton", ({ enumerable: true, get: function () { return unread_first_button_1.UnreadFirstButton; } }));
const config_keys_1 = __webpack_require__(/*! ./config-keys */ "./src/config-keys.ts");
const mailbox_utils_1 = __webpack_require__(/*! ./mailbox-utils */ "./src/mailbox-utils.ts");
const unread_first_feature_1 = __webpack_require__(/*! ./unread-first-feature */ "./src/unread-first-feature.ts");
const mailboxUtils = new mailbox_utils_1.MailboxUtils();
const inboxSort = new unread_first_feature_1.InboxSortFeature(() => mailboxUtils.refreshCurrentMailbox());
let _unreadDisposer = null;
let _starredDisposer = null;
function updateSortFeature() {
    const unread = !!AppEnv.config.get(config_keys_1.CONFIG_KEYS.UNREAD_FIRST);
    const starred = !!AppEnv.config.get(config_keys_1.CONFIG_KEYS.STARRED_FIRST);
    if (unread || starred) {
        inboxSort.enable();
    }
    else {
        inboxSort.disable();
    }
}
function activate() {
    mailspring_exports_1.ComponentRegistry.register(unread_first_button_1.default, {
        location: mailspring_exports_1.WorkspaceStore.Location.RootSidebar.Toolbar,
    });
    _unreadDisposer = AppEnv.config.observe(config_keys_1.CONFIG_KEYS.UNREAD_FIRST, () => {
        updateSortFeature();
    });
    _starredDisposer = AppEnv.config.observe(config_keys_1.CONFIG_KEYS.STARRED_FIRST, () => {
        updateSortFeature();
    });
    updateSortFeature();
    console.log('[mailspring-toolbox] initialized');
}
function deactivate() {
    if (_unreadDisposer === null || _unreadDisposer === void 0 ? void 0 : _unreadDisposer.dispose) {
        _unreadDisposer.dispose();
    }
    _unreadDisposer = null;
    if (_starredDisposer === null || _starredDisposer === void 0 ? void 0 : _starredDisposer.dispose) {
        _starredDisposer.dispose();
    }
    _starredDisposer = null;
    inboxSort.disable();
}


/***/ },

/***/ "./src/unread-first-button.tsx"
/*!*************************************!*\
  !*** ./src/unread-first-button.tsx ***!
  \*************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UnreadFirstButton = void 0;
const mailspring_exports_1 = __webpack_require__(/*! mailspring-exports */ "mailspring-exports");
const mailspring_component_kit_1 = __webpack_require__(/*! mailspring-component-kit */ "mailspring-component-kit");
const config_keys_1 = __webpack_require__(/*! ./config-keys */ "./src/config-keys.ts");
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
class InboxSortDropdown extends mailspring_exports_1.React.Component {
    constructor(props) {
        super(props);
        this._onSelectItem = (item) => {
            if (!item) {
                return;
            }
            if (item.id === 'unread') {
                AppEnv.config.set(config_keys_1.CONFIG_KEYS.UNREAD_FIRST, !this.state.unreadFirst);
            }
            else if (item.id === 'starred') {
                AppEnv.config.set(config_keys_1.CONFIG_KEYS.STARRED_FIRST, !this.state.starredFirst);
            }
            else if (item.id === 'default') {
                AppEnv.config.set(config_keys_1.CONFIG_KEYS.UNREAD_FIRST, false);
                AppEnv.config.set(config_keys_1.CONFIG_KEYS.STARRED_FIRST, false);
            }
            mailspring_exports_1.Actions.closePopover();
        };
        this._onToggleDropdown = () => {
            const domNode = mailspring_exports_1.ReactDOM.findDOMNode(this);
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
            mailspring_exports_1.Actions.openPopover(mailspring_exports_1.React.createElement("div", { className: "inbox-sort-popover", style: { width: 220, minWidth: 220 } },
                mailspring_exports_1.React.createElement(mailspring_component_kit_1.Menu, { defaultSelectedIndex: -1, items: items, itemKey: (item) => item.id, itemChecked: (item) => {
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
                    }, itemContent: (item) => (mailspring_exports_1.React.createElement("span", { style: { display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap', width: '100%' } },
                        mailspring_exports_1.React.createElement(mailspring_component_kit_1.RetinaImg, { name: item.icon, mode: mailspring_component_kit_1.RetinaImg.Mode.ContentIsMask, style: {
                                marginRight: 10,
                                width: 16,
                                height: 16,
                                backgroundColor: 'currentColor',
                                flexShrink: 0,
                            } }),
                        mailspring_exports_1.React.createElement("span", { style: { whiteSpace: 'nowrap' } }, item.name))), onSelect: this._onSelectItem, onEscape: () => mailspring_exports_1.Actions.closePopover() })), {
                originRect: buttonRect,
                direction: 'down',
            });
        };
        this.state = {
            unreadFirst: !!AppEnv.config.get(config_keys_1.CONFIG_KEYS.UNREAD_FIRST),
            starredFirst: !!AppEnv.config.get(config_keys_1.CONFIG_KEYS.STARRED_FIRST),
        };
    }
    componentDidMount() {
        this._unreadDisposer = AppEnv.config.observe(config_keys_1.CONFIG_KEYS.UNREAD_FIRST, (enabled) => {
            this.setState({ unreadFirst: !!enabled });
        });
        this._starredDisposer = AppEnv.config.observe(config_keys_1.CONFIG_KEYS.STARRED_FIRST, (enabled) => {
            this.setState({ starredFirst: !!enabled });
        });
    }
    componentWillUnmount() {
        var _a, _b;
        if ((_a = this._unreadDisposer) === null || _a === void 0 ? void 0 : _a.dispose) {
            this._unreadDisposer.dispose();
        }
        if ((_b = this._starredDisposer) === null || _b === void 0 ? void 0 : _b.dispose) {
            this._starredDisposer.dispose();
        }
        this._unreadDisposer = null;
        this._starredDisposer = null;
    }
    render() {
        const { unreadFirst, starredFirst } = this.state;
        let title = 'Inbox sorting: Default (date)';
        let iconName = 'toolbar-markasread.png';
        if (unreadFirst && starredFirst) {
            title = 'Inbox sorting: Starred & Unread first';
            iconName = 'toolbar-star-selected.png';
        }
        else if (starredFirst) {
            title = 'Inbox sorting: Starred first';
            iconName = 'toolbar-star-selected.png';
        }
        else if (unreadFirst) {
            title = 'Inbox sorting: Unread first';
            iconName = 'toolbar-markasunread.png';
        }
        return (mailspring_exports_1.React.createElement("span", { style: { display: 'inline-flex', alignItems: 'center', order: 100 } },
            mailspring_exports_1.React.createElement("style", { dangerouslySetInnerHTML: { __html: STYLES } }),
            mailspring_exports_1.React.createElement("button", { className: "btn btn-toolbar item-compose item-inbox-sort", style: {
                    display: 'inline-flex',
                    alignItems: 'center',
                }, title: title, onClick: this._onToggleDropdown },
                mailspring_exports_1.React.createElement(mailspring_component_kit_1.RetinaImg, { name: iconName, mode: mailspring_component_kit_1.RetinaImg.Mode.ContentIsMask }),
                mailspring_exports_1.React.createElement(mailspring_component_kit_1.RetinaImg, { name: "toolbar-dropdown-chevron.png", mode: mailspring_component_kit_1.RetinaImg.Mode.ContentIsMask, style: { marginLeft: 3 } }))));
    }
}
InboxSortDropdown.displayName = 'InboxSortDropdown';
exports["default"] = InboxSortDropdown;
exports.UnreadFirstButton = InboxSortDropdown;


/***/ },

/***/ "./src/unread-first-feature.ts"
/*!*************************************!*\
  !*** ./src/unread-first-feature.ts ***!
  \*************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UnreadFirstFeature = exports.InboxSortFeature = void 0;
const mailspring_exports_1 = __webpack_require__(/*! mailspring-exports */ "mailspring-exports");
const config_keys_1 = __webpack_require__(/*! ./config-keys */ "./src/config-keys.ts");
class InboxSortFeature {
    constructor(refreshCallback) {
        this.refreshCallback = refreshCallback;
        this._enabled = false;
        this._focusUnlisten = null;
        this._patchedProto = null;
        this._originalMethod = null;
    }
    enable() {
        var _a, _b, _c;
        if (this._enabled) {
            (_a = this.refreshCallback) === null || _a === void 0 ? void 0 : _a.call(this);
            return;
        }
        this._enabled = true;
        const currentPerspective = (_b = mailspring_exports_1.FocusedPerspectiveStore.current) === null || _b === void 0 ? void 0 : _b.call(mailspring_exports_1.FocusedPerspectiveStore);
        if (currentPerspective && ((_c = currentPerspective.constructor) === null || _c === void 0 ? void 0 : _c.name) === 'CategoryMailboxPerspective') {
            this.patchPerspective(currentPerspective);
        }
        this._focusUnlisten = mailspring_exports_1.Actions.focusMailboxPerspective.listen((mailbox) => {
            var _a;
            if (!this._enabled) {
                return;
            }
            if (((_a = mailbox === null || mailbox === void 0 ? void 0 : mailbox.constructor) === null || _a === void 0 ? void 0 : _a.name) === 'CategoryMailboxPerspective') {
                this.patchPerspective(mailbox);
            }
        });
        // Trigger fake reload if not patched yet
        if (!this._patchedProto && currentPerspective) {
            mailspring_exports_1.Actions.focusMailboxPerspective(currentPerspective);
        }
        console.log('[mailspring-toolbox-inbox-sort] enabled');
    }
    patchPerspective(mailbox) {
        var _a;
        if (!mailbox || !mailbox.constructor || mailbox.constructor.name !== 'CategoryMailboxPerspective') {
            return;
        }
        const proto = Object.getPrototypeOf(mailbox);
        if (!proto) {
            return;
        }
        if (proto.threads && proto.threads.__inboxSortPatched) {
            this._patchedProto = proto;
            return;
        }
        this._patchedProto = proto;
        this._originalMethod = proto.threads;
        const combineOrders = this.combineOrders.bind(this);
        // Mimic behavior of CategoryMailboxPerspective with configurable ordering
        proto.threads = function threadsInboxSort() {
            const query = mailspring_exports_1.DatabaseStore.findAll(mailspring_exports_1.Thread)
                .where([mailspring_exports_1.Thread.attributes.categories.containsAny(this.categories().map((c) => c.id))])
                .limit(0);
            if (this.isInbox()) {
                const isUnreadFirst = !!AppEnv.config.get(config_keys_1.CONFIG_KEYS.UNREAD_FIRST);
                const isStarredFirst = !!AppEnv.config.get(config_keys_1.CONFIG_KEYS.STARRED_FIRST);
                const orders = [];
                if (isStarredFirst) {
                    orders.push(mailspring_exports_1.Thread.attributes.starred.descending());
                }
                if (isUnreadFirst) {
                    orders.push(mailspring_exports_1.Thread.attributes.unread.descending());
                }
                if (orders.length > 0) {
                    orders.push(mailspring_exports_1.Thread.attributes.lastMessageReceivedTimestamp.descending());
                    query.order(combineOrders(...orders));
                }
            }
            if (this.isSent()) {
                query.order(mailspring_exports_1.Thread.attributes.lastMessageSentTimestamp.descending());
            }
            if (!['spam', 'trash'].includes(this.categoriesSharedRole())) {
                query.where({ inAllMail: true });
            }
            if (this._categories.length > 1 && this.accountIds.length < this._categories.length) {
                query.distinct();
            }
            return new mailspring_exports_1.MutableQuerySubscription(query, {
                emitResultSet: true,
                updateOnSeparateThread: true,
            });
        };
        proto.threads.__inboxSortPatched = true;
        if (this._focusUnlisten) {
            this._focusUnlisten();
            this._focusUnlisten = null;
        }
        (_a = this.refreshCallback) === null || _a === void 0 ? void 0 : _a.call(this);
    }
    // Hack to combine multiple order criteria in Mailspring
    combineOrders(...orders) {
        if (orders.length === 0) {
            return null;
        }
        if (orders.length === 1) {
            return orders[0];
        }
        const sqlFns = orders.map(o => o.orderBySQL.bind(o));
        const primary = orders[0];
        primary.orderBySQL = (klass) => sqlFns.map(fn => fn(klass)).join(', ');
        return primary;
    }
    disable() {
        var _a;
        if (!this._enabled) {
            return;
        }
        this._enabled = false;
        if (this._focusUnlisten) {
            this._focusUnlisten();
            this._focusUnlisten = null;
        }
        if (this._patchedProto && this._originalMethod) {
            delete this._patchedProto.threads.__inboxSortPatched;
            this._patchedProto.threads = this._originalMethod;
        }
        this._patchedProto = null;
        this._originalMethod = null;
        (_a = this.refreshCallback) === null || _a === void 0 ? void 0 : _a.call(this);
        console.log('[mailspring-toolbox-inbox-sort] disabled');
    }
}
exports.InboxSortFeature = InboxSortFeature;
exports.UnreadFirstFeature = InboxSortFeature;


/***/ },

/***/ "mailspring-component-kit"
/*!*******************************************!*\
  !*** external "mailspring-component-kit" ***!
  \*******************************************/
(module) {

module.exports = require("mailspring-component-kit");

/***/ },

/***/ "mailspring-exports"
/*!*************************************!*\
  !*** external "mailspring-exports" ***!
  \*************************************/
(module) {

module.exports = require("mailspring-exports");

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Check if module exists (development only)
/******/ 		if (__webpack_modules__[moduleId] === undefined) {
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/main.ts");
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=main.js.map