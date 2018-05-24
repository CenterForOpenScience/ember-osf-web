import { action, computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Controller from '@ember/controller';
import Cookies from 'ember-cookies/services/cookies';
import config from 'ember-get-config';
import I18n from 'ember-i18n/services/i18n';
import moment, { Moment } from 'moment';

import Node from 'ember-osf-web/models/node';
import AnalyticsService from 'ember-osf-web/services/analytics';
import defaultTo from 'ember-osf-web/utils/default-to';

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

    activeDateRange: DateRange = defaultTo(this.activeDateRange, this.dateRanges[0]);

    hideAdblockWarning: boolean = defaultTo(
        this.hideAdblockWarning,
        Boolean(this.cookies.read(dismissAdblockCookie)),
    );

    @computed
    get forksCount(this: ApplicationController) {
        const node: Node = this.model.taskInstance.value;
        return node.relationshipLinks.forks.links.related.meta.count;
    }

    @computed
    get linkedByCount(this: ApplicationController) {
        const node: Node = this.model.taskInstance.value;
        return node.relationshipLinks.linked_by_nodes.links.related.meta.count;
    }

    @computed
    get templatedByCount(this: ApplicationController) {
        const node: Node = this.model.taskInstance.value;
        return node.apiMeta.templated_by_count;
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
    }
}
