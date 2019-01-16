import { tagName } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import { task } from 'ember-concurrency';
import DS from 'ember-data';
import I18N from 'ember-i18n/services/i18n';

import { layout } from 'ember-osf-web/decorators/component';
import Contributor from 'ember-osf-web/models/contributor';
import Node from 'ember-osf-web/models/node';
import { QueryHasManyResult } from 'ember-osf-web/models/osf-model';
import Ready from 'ember-osf-web/services/ready';
import defaultTo from 'ember-osf-web/utils/default-to';

import styles from './styles';
import template from './template';

@layout(template, styles)
@tagName('span')
export default class ContributorList extends Component.extend({
    didReceiveAttrs(this: ContributorList) {
        assert('@node is required for <ContributorList>', Boolean(this.node));

        this.loadContributors.perform();
    },

    loadContributors: task(function *(this: ContributorList, more?: boolean) {
        const blocker = this.ready.getBlocker();

        let { displayedContributors } = this;
        let totalContributors: number;
        if (this.shouldLoadAll && !this.shouldTruncate) {
            const allContributors = yield this.node.loadAll('contributors');
            displayedContributors = allContributors.toArray();
            totalContributors = allContributors.length;
        } else if (more) {
            const nextPage: QueryHasManyResult<Contributor> = yield this.node.queryHasMany('contributors', {
                page: this.incrementProperty('page'),
            });
            displayedContributors.pushObjects(nextPage);
            totalContributors = nextPage.meta.total;
        } else {
            this.set('page', 1);
            const firstPage = yield this.node.contributors;
            totalContributors = firstPage.meta.total;
        }

        if (!this.shouldShowNonBibliographic) {
            displayedContributors = displayedContributors.filter(c => c.bibliographic);
        }

        this.setProperties({
            displayedContributors,
            totalContributors,
        });

        blocker.done();
    }).enqueue(),
}) {
    // Required arguments
    node!: Node;

    // Optional arguments
    shouldTruncate: boolean = defaultTo(this.shouldTruncate, true);
    shouldLinkUsers: boolean = defaultTo(this.shouldLinkUsers, false);
    shouldShowNonBibliographic: boolean = defaultTo(this.shouldShowNonBibliographic, false);

    // Private properties
    @service i18n!: I18N;
    @service store!: DS.Store;
    @service ready!: Ready;

    page = 1;
    displayedContributors: Contributor[] = [];
    totalContributors?: number;
    shouldLoadAll: boolean = navigator.userAgent.includes('Prerender');

    @alias('loadContributors.isRunning')
    isLoading!: boolean;

    @computed('truncated')
    get truncateCount() {
        return this.shouldTruncate ? 3 : undefined;
    }
}
