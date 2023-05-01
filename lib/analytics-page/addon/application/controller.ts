import Store from '@ember-data/store';
import Controller from '@ember/controller';
import { action, computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';

import Node from 'ember-osf-web/models/node';
import AnalyticsService from 'ember-osf-web/services/analytics';
import { Timespan, TIMESPANS } from './route';

export default class ApplicationController extends Controller {
    @service analytics!: AnalyticsService;
    @service router!: RouterService;
    @service store!: Store;

    queryParams = ['timespan'];
    timespan: Timespan = 'week';
    allTimespans = TIMESPANS;

    timespanIntlKeys: Record<Timespan, string> = {
        week: 'analytics.dateRanges.pastWeek',
        fortnight: 'analytics.dateRanges.pastTwoWeeks',
        month: 'analytics.dateRanges.pastMonth',
    };

    linksModalShown = false;

    userIsBot = navigator.userAgent.includes('Prerender');

    linkedByQueryParams = { embed: 'bibliographic_contributors' };

    @reads('model.nodeWithCountsTaskInstance.value.taskInstance.value')
    node?: Node;

    @reads('model.nodeWithCountsTaskInstance.isRunning')
    loading?: boolean;

    @reads('node.relationshipLinks.forks.links.related.meta.count')
    forksCount?: number;

    @reads('node.relationshipLinks.linked_by_nodes.links.related.meta.count')
    linkedByCount?: number;

    @reads('node.apiMeta.templated_by_count')
    templatedByCount?: number;

    @computed('node.public')
    get nodePrivate(): boolean {
        const { node } = this;
        return Boolean(node && !node.public);
    }

    @computed('node', 'nodePrivate', 'userIsBot')
    get chartsEnabled(): boolean {
        return Boolean(this.node && !this.nodePrivate && !this.userIsBot);
    }

    @action
    setTimespan(timespan: Timespan) {
        this.analytics.click(
            'button',
            `Analytics - Choose date range "${timespan}"`,
        );
        this.router.transitionTo({ queryParams: { timespan } });
    }

    @action
    showLinksModal() {
        this.set('linksModalShown', true);
        this.analytics.click(
            'button',
            'Analytics - View links - Open modal',
        );
    }

    @action
    hideLinksModal() {
        this.set('linksModalShown', false);
        this.analytics.click(
            'button',
            'Analytics - View links - Close modal',
        );
    }
}
