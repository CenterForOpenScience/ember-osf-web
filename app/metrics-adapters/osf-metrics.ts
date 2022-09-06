import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';

import Cookies from 'ember-cookies/services/cookies';
import config from 'ember-get-config';
import BaseAdapter from 'ember-metrics/metrics-adapters/base';
import moment from 'moment';

import CurrentUser from 'ember-osf-web/services/current-user';

const {
    OSF: {
        apiUrl,
        cookies: {
            cookieConsent: cookieConsentCookie,
            keenSessionId: sessionIdCookie,
        },
    },
} = config;

export interface RouteMetricsInfo {
    itemGuid?: string;
    searchProviderId?: string;
}

type ActionLabel = 'web' | 'view' | 'search';

export default class OsfMetrics extends BaseAdapter {
    @service router!: RouterService;
    @service cookies!: Cookies;
    @service currentUser!: CurrentUser;

    init() {
        // empty
    }

    toStringExtension() {
        return 'osf-metrics';
    }

    // TODO for click/interaction metrics
    // trackEvent() {}

    async trackPage() {
        await this.currentUser.authenticatedAJAX({
            method: 'POST',
            url: `${apiUrl}/_/metrics/events/counted_usage/`,
            data: JSON.stringify(this._countedUsagePayload),
            headers: {
                'Content-Type': 'application/vnd.api+json',
            },
        });
    }

    willDestroy() {
        // empty
    }

    get _countedUsagePayload() {
        return {
            data: {
                type: 'counted-usage',
                attributes: {
                    pageview_info: {
                        page_url: document.URL,
                        page_title: document.title,
                        referer_url: document.referrer,
                        route_name: `ember-osf-web.${this.router.currentRouteName}`,
                    },
                    ...this._countedUsageAttrs,
                },
            },
        };
    }

    get _countedUsageAttrs() {
        const routeMetrics = this._getRouteMetricsInfo();
        const all_attrs = {
            item_guid: routeMetrics.itemGuid,
            provider_id: routeMetrics.searchProviderId,
            action_labels: this._getActionLabels(routeMetrics),
            client_session_id: this._sessionId,
        } as const;
        return Object.fromEntries(
            Object.entries(all_attrs).filter(
                ([_,value]: [unknown, unknown]) => (typeof value !== 'undefined'),
            ),
        );
    }

    get _sessionId() {
        if (!this.cookies.exists(cookieConsentCookie)) {
            return undefined;
        }
        const sessionId = (
            this.cookies.read(sessionIdCookie)
            || ('randomUUID' in crypto && (crypto as any).randomUUID())
            || Math.random().toString()
        );
        this.cookies.write(sessionIdCookie, sessionId, {
            expires: moment().add(25, 'minutes').toDate(),
            path: '/',
        });
        return sessionId;
    }

    _getRouteMetricsInfo(routeInfo?: any): RouteMetricsInfo {
        const thisRouteInfo = (routeInfo || this.router.currentRoute);
        if (thisRouteInfo?.metadata?.osfMetrics) {
            return thisRouteInfo.metadata.osfMetrics;
        }
        if (thisRouteInfo?.parent) {
            return this._getRouteMetricsInfo(thisRouteInfo.parent);
        }
        return {};
    }

    _getActionLabels(routeMetrics: RouteMetricsInfo): ActionLabel[] {
        const actionLabelMap: Record<ActionLabel, Boolean> = {
            web: true,
            view: Boolean(routeMetrics.itemGuid),
            search: Boolean(routeMetrics.searchProviderId),
        };
        const labels = Object.keys(actionLabelMap) as ActionLabel[];
        return labels.filter(label => actionLabelMap[label]);
    }
}
