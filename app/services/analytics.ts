import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import { get } from '@ember/object';
import { run } from '@ember/runloop';
import Service from '@ember/service';
import config from 'ember-get-config';

export enum analyticPrivacy {
    public = 'public',
    private = 'private',
    undefined = 'n/a',
}

export default class Analytics extends Service {
    @service metrics;
    @service session;
    @service router;

    @action
    click(category, label, extraInfo) {
        let extra = extraInfo;
        if (extra && typeof extra !== 'string') {
            // This is to remove the event object when used with onclick
            extra = null;
        }
        get(this, 'metrics')
            .trackEvent({
                category,
                action: 'click',
                label,
                extra,
            });

        return true;
    }

    track(category, actionName, label, extraInfo) {
        let extra = extraInfo;
        if (extra && typeof extra !== 'string') {
            extra = null;
        }
        get(this, 'metrics')
            .trackEvent({
                category,
                actionName,
                label,
                extra,
            });
        return true;
    }

    trackPage(
        publicPrivate: analyticPrivacy = analyticPrivacy.undefined,
        resourceType: string = 'n/a',
        ) {
        run.next(this, () => {
            const {
                authenticated,
                isPublic,
                resource,
            } = config.metricsAdapters[0].dimensions;
            const router = get(this, 'router');
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
            get(this, 'metrics').trackPage({
                [authenticated]: get(this, 'session.isAuthenticated') ? 'Logged in' : 'Logged out',
                [isPublic]: publicPrivate,
                page,
                [resource]: resourceType,
                title,
            });
        });
    }
}

declare module '@ember/service' {
    interface Registry {
        'analytics': Analytics;
    }
}
