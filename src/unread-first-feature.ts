import {Actions, DatabaseStore, FocusedPerspectiveStore, MutableQuerySubscription, Thread} from 'mailspring-exports';
import {CONFIG_KEYS} from './config-keys';

export class InboxSortFeature {

    private _enabled = false;
    private _focusUnlisten: any = null;
    private _patchedProto: any = null;
    private _originalMethod: any = null;

    constructor(private refreshCallback?: () => void) {}

    enable() {
        if (this._enabled) {
            this.refreshCallback?.();
            return;
        }

        this._enabled = true;

        const currentPerspective = FocusedPerspectiveStore.current?.();
        if (currentPerspective && currentPerspective.constructor?.name === 'CategoryMailboxPerspective') {
            this.patchPerspective(currentPerspective);
        }

        this._focusUnlisten = Actions.focusMailboxPerspective.listen((mailbox: any) => {
            if (!this._enabled) {
                return;
            }

            if (mailbox?.constructor?.name === 'CategoryMailboxPerspective') {
                this.patchPerspective(mailbox);
            }
        });

        // Trigger fake reload if not patched yet
        if (!this._patchedProto && currentPerspective) {
            Actions.focusMailboxPerspective(currentPerspective);
        }

        console.log('[mailspring-toolbox-inbox-sort] enabled');
    }

    private patchPerspective(mailbox: any) {
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
        proto.threads = function threadsInboxSort(this: any) {
            const query = DatabaseStore.findAll(Thread)
                .where([Thread.attributes.categories.containsAny(this.categories().map((c: any) => c.id))])
                .limit(0);

            if (this.isInbox()) {
                const isUnreadFirst = !!AppEnv.config.get(CONFIG_KEYS.UNREAD_FIRST);
                const isStarredFirst = !!AppEnv.config.get(CONFIG_KEYS.STARRED_FIRST);

                const orders: any[] = [];
                if (isStarredFirst) {
                    orders.push(Thread.attributes.starred.descending());
                }
                if (isUnreadFirst) {
                    orders.push(Thread.attributes.unread.descending());
                }

                if (orders.length > 0) {
                    orders.push(Thread.attributes.lastMessageReceivedTimestamp.descending());
                    query.order(combineOrders(...orders));
                }
            }

            if (this.isSent()) {
                query.order(Thread.attributes.lastMessageSentTimestamp.descending());
            }

            if (!['spam', 'trash'].includes(this.categoriesSharedRole())) {
                query.where({ inAllMail: true });
            }

            if (this._categories.length > 1 && this.accountIds.length < this._categories.length) {
                query.distinct();
            }

            return new MutableQuerySubscription(query, {
                emitResultSet: true,
                updateOnSeparateThread: true,
            });
        };

        proto.threads.__inboxSortPatched = true;

        if (this._focusUnlisten) {
            this._focusUnlisten();
            this._focusUnlisten = null;
        }

        this.refreshCallback?.();
    }

    // Hack to combine multiple order criteria in Mailspring
    private combineOrders(...orders: any[]) {
        if (orders.length === 0) {
            return null;
        }
        if (orders.length === 1) {
            return orders[0];
        }

        const sqlFns = orders.map(o => o.orderBySQL.bind(o));
        const primary = orders[0];
        primary.orderBySQL = (klass: any) => sqlFns.map(fn => fn(klass)).join(', ');
        return primary;
    }

    disable() {
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

        this.refreshCallback?.();

        console.log('[mailspring-toolbox-inbox-sort] disabled');
    }
}

export const UnreadFirstFeature = InboxSortFeature;
