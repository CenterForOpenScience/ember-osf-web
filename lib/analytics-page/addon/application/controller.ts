import { action, computed } from '@ember-decorators/object';
import { reads } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Controller from '@ember/controller';
import Cookies from 'ember-cookies/services/cookies';
import DS from 'ember-data';
import config from 'ember-get-config';
import I18n from 'ember-i18n/services/i18n';
import moment, { Moment } from 'moment';

import Node from 'ember-osf-web/models/node';
import AnalyticsService from 'ember-osf-web/services/analytics';

const {
    OSF: {
        cookies: {
            analyticsDismissAdblock: dismissAdblockCookie,
        },
    },
} = config;

interface DateRange {
    key: string;
    start: Moment;
    end: Moment;
}

export default class ApplicationController extends Controller {
    @service cookies!: Cookies;
    @service i18n!: I18n;
    @service analytics!: AnalyticsService;
    @service store!: DS.Store;

    dateRanges: DateRange[] = [
        {
            key: 'pastWeek',
            start: moment().subtract(1, 'weeks'),
            end: moment(),
        },
        {
            key: 'pastTwoWeeks',
            start: moment().subtract(2, 'weeks'),
            end: moment(),
        },
        {
            key: 'pastMonth',
            start: moment().subtract(1, 'months'),
            end: moment(),
        },
    ];

    activeDateRange = this.dateRanges[0];
    linksModalShown = false;

    hideAdblockWarning = Boolean(this.cookies.read(dismissAdblockCookie));
    userIsBot = navigator.userAgent.includes('Prerender');

    linkedByQueryParams = { embed: 'bibliographic_contributors' };

    @reads('model.taskInstance.value')
    node?: Node;

    @reads('model.taskInstance.isRunning')
    loading?: boolean;

    @reads('node.relationshipLinks.forks.links.related.meta.count')
    forksCount?: number;

    @reads('node.relationshipLinks.linked_by_nodes.links.related.meta.count')
    linkedByCount?: number;

    @reads('node.apiMeta.templated_by_count')
    templatedByCount?: number;

    @computed('node.public', 'model.{id,modelName}')
    get nodePublic() {
        const node: Node | null = this.node || this.store.peekRecord(this.model.modelName, this.model.id);
        return node && node.public;
    }

    @computed('nodePublic', 'userIsBot')
    get chartsEnabled() {
        return this.nodePublic && !this.userIsBot;
    }

    @action
    dismissAdblockWarning(this: ApplicationController) {
        this.cookies.write(dismissAdblockCookie, 1, { path: '/' });
        this.set('hideAdblockWarning', true);
        this.analytics.click(
            'button',
            'Analytics - Dismiss adblock warning',
        );
    }

    @action
    setDateRange(this: ApplicationController, dateRange: DateRange) {
        this.set('activeDateRange', dateRange);
        this.analytics.click(
            'button',
            `Analytics - Choose date range "${dateRange.key}"`,
        );
    }

    @action
    showLinksModal(this: ApplicationController) {
        this.set('linksModalShown', true);
        this.analytics.click(
            'button',
            'Analytics - View links - Open modal',
        );
    }

    @action
    hideLinksModal(this: ApplicationController) {
        this.set('linksModalShown', false);
        this.analytics.click(
            'button',
            'Analytics - View links - Close modal',
        );
    }
}
