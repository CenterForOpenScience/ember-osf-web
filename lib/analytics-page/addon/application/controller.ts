import { action } from '@ember-decorators/object';
import { reads } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Controller from '@ember/controller';
import Cookies from 'ember-cookies/services/cookies';
import config from 'ember-get-config';
import I18n from 'ember-i18n/services/i18n';
import moment, { Moment } from 'moment';

import Node from 'ember-osf-web/models/node';
import AnalyticsService from 'ember-osf-web/services/analytics';

const {
    OSF: {
        analyticsDismissAdblockCookie: dismissAdblockCookie,
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
    hideAdblockWarning = Boolean(this.cookies.read(dismissAdblockCookie));
    linksModalShown = false;
    linksQueryParams = { embed: 'contributors' };

    @reads('model.taskInstance.value')
    node?: Node;

    @reads('node.relationshipLinks.forks.links.related.meta.count')
    forksCount?: number;

    @reads('node.relationshipLinks.linked_by_nodes.links.related.meta.count')
    linkedByCount?: number;

    @reads('node.apiMeta.templated_by_count')
    templatedByCount?: number;

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
