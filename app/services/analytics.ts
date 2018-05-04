import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Service from '@ember/service';
import { task, waitForQueue } from 'ember-concurrency';
import config from 'ember-get-config';
import Metrics from 'ember-metrics/services/metrics';
import Session from 'ember-simple-auth/services/session';

export enum analyticPrivacy {
    public = 'public',
    private = 'private',
    undefined = 'n/a',
}

export default class Analytics extends Service {
    @service metrics!: Metrics;
    @service session!: Session;
    @service router!: any;

    trackPageTask = task(function *(
        this: Analytics,
        publicPrivate: analyticPrivacy,
        resourceType: string,
    ) {
        const {
            authenticated,
            isPublic,
            resource,
        } = config.metricsAdapters[0].dimensions;

        const session = this.get('session');
        yield waitForQueue('afterRender');
        const router = this.get('router');
        const page = router.get('currentURL');
        const title = router.get('currentRouteName');

        /*
          There's supposed to be a document describing how dimensions should be handled, but it doesn't exist yet.
          When it does, we'll replace out this comment with the link to that documentation. For now:
              1) isPublic: public, private, or n/a (for pages that aren't covered by app permissions like the
              dashboard;
              2) authenticated: Logged in or Logged out
              3) resource: the JSONAPI type (node, file, user, etc) or n/a
        */
        this.get('metrics').trackPage({
            [authenticated]: session.get('isAuthenticated') ? 'Logged in' : 'Logged out',
            [isPublic]: publicPrivate,
            page,
            [resource]: resourceType,
            title,
        });
    });

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
                actionName,
                label,
                extra,
            });
        return true;
    }

    trackPage(
        this: Analytics,
        publicPrivate: analyticPrivacy = analyticPrivacy.undefined,
        resourceType: string = 'n/a',
    ) {
        this.get('trackPageTask').perform(publicPrivate, resourceType);
    }
}

declare module '@ember/service' {
    interface Registry {
        'analytics': Analytics;
    }
}
