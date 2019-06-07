import { tagName } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
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
    loadContributors: task(function *(this: ContributorList, more?: boolean) {
        if (!this.node || this.node.isAnonymous) {
            return;
        }

        const blocker = this.ready.getBlocker();
        if (this.shouldLoadAll && !this.shouldTruncate) {
            const allContributors = yield this.node.loadAll('bibliographicContributors');
            this.setProperties({
                displayedContributors: allContributors.toArray(),
                totalContributors: allContributors.length,
            });
        } else if (more) {
            const nextPage: QueryHasManyResult<Contributor> = yield this.node.queryHasMany(
                'bibliographicContributors',
                { page: this.incrementProperty('page') },
            );
            this.displayedContributors.pushObjects(nextPage);
            this.set('totalContributors', nextPage.meta.total);
        } else {
            this.set('page', 1);
            const firstPage = yield this.node.bibliographicContributors;
            this.setProperties({
                displayedContributors: firstPage.toArray(),
                totalContributors: firstPage.meta.total,
            });
        }

        blocker.done();
    }).on('didReceiveAttrs').restartable(),
}) {
    // Required arguments
    node?: Node;

    // Optional arguments
    shouldTruncate: boolean = defaultTo(this.shouldTruncate, true);
    shouldLinkUsers: boolean = defaultTo(this.shouldLinkUsers, false);

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
