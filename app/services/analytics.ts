import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import { assert, debug, runInDebug } from '@ember/debug';
import RouterService from '@ember/routing/router-service';
import Service from '@ember/service';
import { task, waitForQueue } from 'ember-concurrency';
import config from 'ember-get-config';
import Metrics from 'ember-metrics/services/metrics';
import Session from 'ember-simple-auth/services/session';
import Toast from 'ember-toastr/services/toast';

import Ready from 'ember-osf-web/services/ready';

const {
    metricsAdapters,
    OSF: {
        analyticsAttrs,
    },
} = config;

export interface TrackedData {
    category?: string;
    action?: string;
    extra?: string;
    label: string;
}

export interface InitialEventInfo {
    name?: string;
    category?: string;
    action?: string;
    extra?: string;
}

function logEvent(analytics: Analytics, title: string, data: object) {
    runInDebug(() => {
        const logMessage = Object.entries(data)
            .map(([k, v]) => `${k}: ${v}`)
            .join(', ');
        debug(`${title}: ${logMessage}`);
    });

    if (analytics.shouldToastOnEvent) {
        analytics.toast.info(
            Object.entries(data)
                .filter(([_, v]) => v !== undefined)
                .map(([k, v]) => `<div>${k}: <strong>${v}</strong></div>`)
                .join(''),
            title,
            { preventDuplicates: false },
        );
    }
}

class EventInfo {
    scopes: string[] = [];
    name?: string;
    category?: string;
    action?: string;
    extra?: string;

    constructor(targetElement: Element, rootElement: Element, initialInfo?: InitialEventInfo) {
        if (initialInfo) {
            Object.assign(this, initialInfo);
        }
        this.gatherMetadata(targetElement, rootElement);
    }

    isValid(): boolean {
        return Boolean(this.name && this.scopes.length);
    }

    gatherMetadata(targetElement: Element, rootElement: Element) {
        let element: Element | null = targetElement;
        while (element && element !== rootElement) {
            this._gatherMetadataFromElement(element);
            element = element.parentElement;
        }
    }

    trackedData(): TrackedData {
        return {
            category: this.category,
            action: this.action,
            label: [...this.scopes.reverse(), this.name].join(' - '),
            extra: this.extra,
        };
    }

    _gatherMetadataFromElement(element: Element) {
        if (element.hasAttribute(analyticsAttrs.name)) {
            assert(
                `Multiple names found for an event! ${this.name} and ${element.getAttribute(analyticsAttrs.name)}`,
                !this.name,
            );
            this.name = element.getAttribute(analyticsAttrs.name)!;

            this._gatherAction(element);
            this._gatherExtra(element);
            this._gatherCategory(element);
        } else if (element.hasAttribute(analyticsAttrs.scope)) {
            this.scopes.push(element.getAttribute(analyticsAttrs.scope)!);
        }
    }

    _gatherAction(element: Element) {
        if (element.hasAttribute(analyticsAttrs.action)) {
            this.action = element.getAttribute(analyticsAttrs.action)!;
        }
    }

    _gatherExtra(element: Element) {
        if (element.hasAttribute(analyticsAttrs.extra)) {
            this.extra = element.getAttribute(analyticsAttrs.extra)!;
        }
    }

    _gatherCategory(element: Element) {
        if (element.hasAttribute(analyticsAttrs.category)) {
            this.category = element.getAttribute(analyticsAttrs.category)!;
        } else if (element.hasAttribute('role')) {
            this.category = element.getAttribute('role')!;
        } else {
            switch (element.tagName) {
            case 'BUTTON':
                this.category = 'button';
                break;
            case 'A':
                this.category = 'link';
                break;
            case 'INPUT':
                if (element.hasAttribute('type')) {
                    this.category = element.getAttribute('type')!;
                }
                break;
            default:
            }
        }

        assert('Event category could not be inferred. It must be set explicitly.', Boolean(this.category));
    }
}

export default class Analytics extends Service {
    @service metrics!: Metrics;
    @service session!: Session;
    @service ready!: Ready;
    @service router!: RouterService;
    @service toast!: Toast;

    shouldToastOnEvent: boolean = false;

    rootElement?: Element;

    trackPageTask = task(function *(
        this: Analytics,
        pagePublic: boolean | undefined,
        resourceType: string,
    ) {
        // Wait until everything has settled
        yield waitForQueue('destroy');

        const eventParams = {
            page: this.router.currentURL,
            title: this.router.currentRouteName,
        };

        logEvent(this, 'Tracked page', {
            pagePublic,
            resourceType,
            ...eventParams,
        });

        const gaConfig = metricsAdapters.findBy('name', 'GoogleAnalytics');
        if (gaConfig) {
            const {
                authenticated,
                isPublic,
                resource,
            } = gaConfig.dimensions!;

            let isPublicValue = 'n/a';
            if (typeof pagePublic !== 'undefined') {
                isPublicValue = pagePublic ? 'public' : 'private';
            }

            /*
              There's supposed to be a document describing how dimensions should be handled, but it doesn't exist yet.
              When it does, we'll replace out this comment with the link to that documentation. For now:
                  1) isPublic: public, private, or n/a (for pages that aren't covered by app permissions like the
                  dashboard;
                  2) authenticated: Logged in or Logged out
                  3) resource: the JSONAPI type (node, file, user, etc) or n/a
            */
            this.metrics.trackPage('GoogleAnalytics', {
                [authenticated]: this.session.isAuthenticated ? 'Logged in' : 'Logged out',
                [isPublic]: isPublicValue,
                [resource]: resourceType,
                ...eventParams,
            });
        }

        this.metrics.trackPage('Keen', {
            pagePublic,
            ...eventParams,
        });
    }).restartable();

    @action
    click(this: Analytics, category: string, label: string, extraInfo?: string | object) {
        let extra = extraInfo;
        if (extra && typeof extra !== 'string') {
            // This is to remove the event object when used with onclick
            extra = undefined;
        }
        this._trackEvent({
            category,
            action: 'click',
            label,
            extra,
        });

        return true;
    }

    track(this: Analytics, category: string, actionName: string, label: string, extraInfo?: string) {
        let extra = extraInfo;
        if (extra && typeof extra !== 'string') {
            extra = undefined;
        }

        this._trackEvent({
            category,
            action: actionName,
            label,
            extra,
        });

        return true;
    }

    trackPage(
        this: Analytics,
        pagePublic?: boolean,
        resourceType: string = 'n/a',
    ) {
        this.get('trackPageTask').perform(pagePublic, resourceType);
    }

    trackFromElement(target: Element, initialInfo: InitialEventInfo) {
        assert(
            'rootElement not set! Check that instance-initializers/analytics ran',
            Boolean(this.rootElement),
        );
        const eventInfo = new EventInfo(target, this.rootElement!, initialInfo);

        if (eventInfo.isValid()) {
            this._trackEvent(eventInfo.trackedData());
        }
    }

    handleClick(e: MouseEvent) {
        assert(
            'rootElement not set! Check that instance-initializers/analytics ran',
            Boolean(this.rootElement),
        );
        if (e.target) {
            const eventInfo = new EventInfo(e.target as Element, this.rootElement!, {
                action: e.type,
            });

            if (eventInfo.isValid()) {
                this._trackEvent(eventInfo.trackedData());
            }
        }
    }

    _trackEvent(trackedData: TrackedData) {
        this.metrics.trackEvent(trackedData);

        logEvent(this, 'Tracked event', trackedData);
    }
}

declare module '@ember/service' {
    interface Registry {
        'analytics': Analytics;
    }
}
