import { tagName } from '@ember-decorators/component';
import { action, computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { task } from 'ember-concurrency';
import DS from 'ember-data';
import I18N from 'ember-i18n/services/i18n';

import Contributor from 'ember-osf-web/models/contributor';
import Node from 'ember-osf-web/models/node';
import { QueryHasManyResult } from 'ember-osf-web/models/osf-model';
import Ready from 'ember-osf-web/services/ready';
import defaultTo from 'ember-osf-web/utils/default-to';

import styles from './styles';
import layout from './template';

export interface Contrib {
    title: string;
    id: string | null;
    bibliographic?: boolean | null;
}

@tagName('span')
export default class ContributorList extends Component.extend({
    didReceiveAttrs(this: ContributorList) {
        if (!this.node) {
            return;
        }
        this.loadContributors.perform();
    },

    loadContributors: task(function *(this: ContributorList, more?: boolean) {
        // Running in Prerender, load and show all contributors at once.
        if (this.userIsBot) {
            const botBlocker = this.ready.getBlocker();

            const allContributors = yield this.node.loadAll('contributors');
            this.set('contributors', allContributors);
            this.set('displayedContribs', allContributors.length);

            botBlocker.done();
            return;
        }

        const contributors = yield this.node.contributors;
        if (!more && contributors) {
            this.set('contributors', contributors);
            return;
        }

        if (more) {
            // we have enough contributors to show, don't request any more.
            const hiddenContribs = this.contributorList.length - this.displayedContribs;
            if (this.rest <= hiddenContribs) {
                if (this.useShowStep) {
                    this.incrementProperty('displayedContribs', this.showStep);
                } else {
                    this.set('displayedContribs', this.contributorList.length);
                }
                return;
            }
        }

        const blocker = this.ready.getBlocker();

        // Fetch more contributors.
        const contribs = yield this.node.queryHasMany('contributors', {
            page: more ? this.incrementProperty('page') : this.set('page', 1),
            'page[size]': this.contribsPerPage,
        });

        if (more && this.contributors) {
            this.contributors.pushObjects(contribs);
            if (this.useShowStep) {
                this.incrementProperty('displayedContribs', this.showStep);
            } else {
                this.set('displayedContribs', this.contributorList.length);
            }
        } else {
            this.set('contributors', contribs);
        }

        blocker.done();
    }).restartable(),
}) {
    layout = layout;
    styles = styles;

    @service i18n!: I18N;
    @service store!: DS.Store;
    @service ready!: Ready;

    page = 1;
    defaultStep = 3;
    userIsBot: boolean = navigator.userAgent.includes('Prerender');
    contributors!: QueryHasManyResult<Contributor>;

    // Required arguments
    node!: Node;

    // Optional arguments
    showStep: number = defaultTo(this.showStep, 0);
    contribsPerPage: number = defaultTo(this.contribsPerPage, 10);
    displayedContribs: number = defaultTo(this.displayedContribs, this.defaultStep);
    showLoading: boolean = defaultTo(this.showLoading, true);
    dark: boolean = defaultTo(this.dark, true);
    useContributorLink: boolean = defaultTo(this.useContributorLink, false);
    useShowMoreLink: boolean = defaultTo(this.useShowMoreLink, false);
    useShowLess: boolean = defaultTo(this.useShowLess, false);
    showNonBibliographic: boolean = defaultTo(this.showNonBibliographic, false);

    @computed('contributors.[]', 'showNonBibliographic')
    get contributorList(this: ContributorList): Contrib[] {
        if (!this.contributors) {
            return [];
        }
        const contributors = this.contributors.toArray();

        if (!(contributors && contributors.length)) {
            return [];
        }

        const contribs: Contrib[] = contributors
            .filter(c => this.get('showNonBibliographic') || c.get('bibliographic'))
            .map(c => ({
                title: c.users.get('familyName') || c.users.get('givenName') || c.users.get('fullName'),
                id: c.get('unregisteredContributor') ? null : c.users.get('id'),
            }));
        return contribs;
    }

    @computed('showStep')
    get useShowStep(this: ContributorList): boolean {
        return Boolean(this.showStep);
    }

    @computed('contributors.meta.total', 'displayedContribs')
    get rest(this: ContributorList): number {
        if (!this.contributors) {
            return 0;
        }
        return this.contributors.meta.total - this.displayedContribs;
    }

    @computed('contributors.{length,meta.total}')
    get hasMore(this: ContributorList): boolean | undefined {
        return this.contributors ? this.contributors.toArray().length < this.contributors.meta.total : undefined;
    }

    @computed('contributors.meta.total', 'showStep', 'displayedContribs', 'useShowLess', 'userIsBot')
    get showLess(this: ContributorList): boolean {
        if (!this.contributors) {
            return false;
        }
        return !this.userIsBot && (this.useShowLess as boolean) &&
              (this.displayedContribs > this.defaultStep) &&
            (this.displayedContribs >= this.contributors.meta.total);
    }

    @action
    more(this: ContributorList) {
        this.get('loadContributors').perform(true);
        return false;
    }

    @action
    less(this: ContributorList) {
        this.set('displayedContribs', this.defaultStep);
        return false;
    }
}
