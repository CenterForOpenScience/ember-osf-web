import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Service from '@ember/service';
import { task, waitForQueue } from 'ember-concurrency';
import config from 'ember-get-config';
import Metrics from 'ember-metrics/services/metrics';
import Session from 'ember-simple-auth/services/session';

import Ready from 'ember-osf-web/services/ready';
import RouteContext from 'ember-osf-web/services/route-context';

export default class Analytics extends Service {
    @service metrics!: Metrics;
    @service session!: Session;
    @service routeContext!: RouteContext;
    @service ready!: Ready;
    @service router!: any;

    trackPageTask = task(function *(
        this: Analytics,
        pagePublic: boolean | undefined,
        resourceType: string,
    ) {
        // Wait until everything has settled
        yield this.routeContext.guidTaskInstance;
        yield waitForQueue('destroy');

        const eventParams = {
            page: this.router.currentURL,
            title: this.router.currentRouteName,
        };

        const gaConfig = config.metricsAdapters.findBy('name', 'GoogleAnalytics');
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
        this.get('metrics')
            .trackEvent({
                category,
                action: 'click',
                label,
                extra,
            });

        return true;
    }

    track(this: Analytics, category: string, actionName: string, label: string, extraInfo?: string | null) {
        let extra = extraInfo;
        if (extra && typeof extra !== 'string') {
            extra = null;
        }
        this.get('metrics')
            .trackEvent({
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
}

declare module '@ember/service' {
    interface Registry {
        'analytics': Analytics;
    }
}
