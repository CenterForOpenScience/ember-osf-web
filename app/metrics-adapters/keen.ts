import { getOwner } from '@ember/application';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import { TaskInstance } from 'ember-concurrency';
import Cookies from 'ember-cookies/services/cookies';
import config from 'ember-get-config';
import BaseAdapter from 'ember-metrics/metrics-adapters/base';
import md5 from 'js-md5';
import KeenTracking from 'keen-tracking';
import moment from 'moment';

import { KeenConfig } from 'config/environment';
import Node from 'ember-osf-web/models/node';
import CurrentUser from 'ember-osf-web/services/current-user';

const {
    OSF: {
        cookies: {
            keenUserId: keenUserIdCookie,
            keenSessionId: keenSessionIdCookie,
        },
    },
} = config;

interface PageParams {
    page: string;
    title: string;
    pagePublic?: boolean;
}

export default class KeenAdapter extends BaseAdapter {
    @service cookies!: Cookies;
    @service currentUser!: CurrentUser;
    @service headData!: any;
    @service router!: RouterService;

    config?: KeenConfig;
    publicClient?: KeenTracking;
    privateClient?: KeenTracking;

    init() {
        if (this.config) {
            if (this.config.public) {
                this.publicClient = new KeenTracking(this.config.public);
                this.publicClient.extendEvents(this.defaultPublicKeenPayload.bind(this));
            }
            if (this.config.private) {
                this.privateClient = new KeenTracking(this.config.private);
                this.privateClient.extendEvents(this.defaultPrivateKeenPayload.bind(this));
            }
        }
    }

    willDestroy() {
        // Required override by ember-metrics' BaseAdapter
    }

    toStringExtension() {
        return 'Keen';
    }

    getCurrentModelTask<T>(): TaskInstance<T> | undefined {
        const owner = getOwner(this);
        const routes: string[] = this.router.currentRouteName.split('.');

        // This is only guaranteed to work with the current implementation of GuidRoute
        // as it returns a uniform model
        for (let i = routes.length; i > 0; i--) {
            const route = owner.lookup(`route:${routes.slice(0, i).join('.')}`);
            if (route && route.currentModel && route.currentModel.taskInstance) {
                const task = route.currentModel.taskInstance;
                if (task && task.isRunning !== undefined) {
                    return task;
                }
            }
        }

        return undefined;
    }

    getCurrentLoadedNode(): Node | undefined {
        const task = this.getCurrentModelTask<Node>();

        if (task && task.value instanceof Node) {
            return task.value;
        }

        return undefined;
    }

    async getCurrentNode(): Promise<Node | undefined> {
        const task = this.getCurrentModelTask<Node>();

        if (task) {
            const model = await task;
            if (model instanceof Node) {
                return model;
            }
        }

        return undefined;
    }

    async trackPage(params: PageParams) {
        const eventProperties = {
            page: {
                meta: {
                    title: params.title,
                    public: params.pagePublic,
                },
            },
        };

        let sendPublicEvent = params.pagePublic;

        const node = await this.getCurrentNode();
        if (node) {
            sendPublicEvent = node.public;
            if (sendPublicEvent) {
                this.trackPublicEvent('pageviews', eventProperties);
                this.trackPublicEvent(`pageviews-${node.id.charAt(0)}`, eventProperties);
            }
        }

        this.trackPrivateEvent('pageviews', eventProperties);
    }

    /* Implement trackEvent to send user actions to Keen
    trackEvent(params) {
        if (sendPublicEvent) {
            this.trackPublicEvent('front-end-events', ...);
        }
        this.trackPrivateEvent('front-end-events', ...);
    };
    */

    trackPublicEvent(collection: string, eventData?: any) {
        if (this.publicClient) {
            this.publicClient.recordEvent(collection, eventData);
        }
    }

    trackPrivateEvent(collection: string, eventData?: any) {
        if (this.privateClient) {
            this.privateClient.recordEvent(collection, eventData);
        }
    }

    getOrCreateKeenId() {
        if (!this.cookies.exists(keenUserIdCookie)) {
            this.cookies.write(
                keenUserIdCookie,
                KeenTracking.helpers.getUniqueId(),
                {
                    expires: moment().add('years', 1).toDate(),
                    path: '/',
                },
            );
        }
        return this.cookies.read(keenUserIdCookie);
    }

    createOrUpdateKeenSession() {
        const sessionId = this.cookies.read(keenSessionIdCookie) || KeenTracking.helpers.getUniqueId();
        this.cookies.write(
            keenSessionIdCookie,
            sessionId,
            {
                expires: moment().add(25, 'minutes').toDate(),
                path: '/',
            },
        );
    }

    defaultKeenPayload() {
        this.createOrUpdateKeenSession();

        let nodeInfo = {};

        const node = this.getCurrentLoadedNode();
        if (node) {
            nodeInfo = {
                id: node.id,
                title: node.title,
                type: node.category,
                tags: node.tags,
            };
        }

        const now = new Date();
        const nowUTC = new Date(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate(),
            now.getUTCHours(),
            now.getUTCMinutes(),
            now.getUTCSeconds(),
            now.getUTCMilliseconds(),
        );

        return {
            page: {
                title: this.headData.title || document.title,
                url: document.URL,
                meta: {},
                info: {},
            },
            referrer: {
                url: document.referrer,
                info: {},
            },
            time: {
                local: KeenTracking.helpers.getDatetimeIndex(now),
                utc: KeenTracking.helpers.getDatetimeIndex(nowUTC),
            },
            node: nodeInfo,
            anon: {
                id: md5(this.cookies.read(keenSessionIdCookie)),
            },
            meta: {
                epoch: 1, // version of pageview event schema
            },
            keen: {
                addons: [
                    {
                        name: 'keen:url_parser',
                        input: {
                            url: 'page.url',
                        },
                        output: 'page.info',
                    },
                    {
                        name: 'keen:url_parser',
                        input: {
                            url: 'referrer.url',
                        },
                        output: 'referrer.info',
                    },
                    {
                        name: 'keen:referrer_parser',
                        input: {
                            referrer_url: 'referrer.url',
                            page_url: 'page.url',
                        },
                        output: 'referrer.info',
                    },
                ],
            },
        };
    }

    defaultPublicKeenPayload() {
        return this.defaultKeenPayload();
    }

    defaultPrivateKeenPayload() {
        const payload: any = this.defaultKeenPayload();

        let userInfo = {};
        const { user } = this.currentUser;
        if (user) {
            userInfo = {
                id: user.id,
                locale: user.locale,
                timezone: user.timezone,
                // entry_point
            };
        }

        payload.visitor = {
            id: this.getOrCreateKeenId(),
            session: this.cookies.read(keenSessionIdCookie),
            returning: Boolean(this.cookies.read(keenUserIdCookie)),
        };
        payload.tech = {
            browser: KeenTracking.helpers.getBrowserProfile(),
            ua: '${keen.user_agent}', // eslint-disable-line no-template-curly-in-string
            ip: '${keen.ip}', // eslint-disable-line no-template-curly-in-string
            info: {},
        };
        payload.user = userInfo;
        payload.keen.addons.push({
            name: 'keen:ip_to_geo',
            input: {
                ip: 'tech.ip',
                remove_ip_property: true,
            },
            output: 'geo',
        });
        payload.keen.addons.push({
            name: 'keen:ua_parser',
            input: {
                ua_string: 'tech.ua',
            },
            output: 'tech.info',
        });

        return payload;
    }
}
