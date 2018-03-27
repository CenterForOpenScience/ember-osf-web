import Service from '@ember/service';
import Ember from 'ember';
import { action } from 'ember-decorators/object';
import config from 'ember-get-config';

export default class Analytics extends Service {
    metrics = Ember.inject.service();
    session = Ember.inject.service();

    @action
    click(category, label, extraInfo) {
        let extra = extraInfo;
        if (extra && typeof extra !== 'string') {
            extra = null;
        }
        Ember.get(this, 'metrics')
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
        Ember.get(this, 'metrics')
            .trackEvent({
                category,
                actionName,
                label,
                extra,
            });
        return true;
    }

    trackPage(page, title, publicPrivate, resourceType) {
        // const page = Ember.get(this, 'url');
        // const title = Ember.getWithDefault(this, 'currentRouteName', 'unknown');
        const {
            authenticated,
            isPublic,
            resource,
        } = config.metricsAdapters[0].dimensions;

        /*
          There's supposed to be a document describing how dimensions should be handled, but it doesn't exist yet.
          When it does, we'll replace out this comment with the link to that documentation. For now:
              1) isPublic: Public, Private, or n/a (for pages that aren't covered by app permissions like the
              dashboard;
              2) authenticated: Logged in or Logged out
              3) resource: the JSONAPI type (node, file, user, etc) or n/a
        */
        Ember.get(this, 'metrics').trackPage({
            [authenticated]: Ember.get(this, 'session.isAuthenticated') ? 'Logged in' : 'Logged out',
            [isPublic]: (publicPrivate === 'public' || publicPrivate === 'private') ? publicPrivate : 'n/a',
            page,
            [resource]: typeof resourceType === 'string' ? resourceType : 'n/a',
            title,
        });
    }
}

declare module '@ember/service' {
    interface Registry {
        'analytics': Analytics;
    }
}
