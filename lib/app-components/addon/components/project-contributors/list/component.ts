import { computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import ArrayProxy from '@ember/array/proxy';
import Component from '@ember/component';
import { task, timeout } from 'ember-concurrency';
import DS from 'ember-data';
import I18N from 'ember-i18n/services/i18n';
import Toast from 'ember-toastr/services/toast';

import { layout } from 'ember-osf-web/decorators/component';
import Contributor from 'ember-osf-web/models/contributor';
import Node from 'ember-osf-web/models/node';
import { Permission } from 'ember-osf-web/models/osf-model';
import Analytics from 'ember-osf-web/services/analytics';

import { HighlightableContributor } from './item/component';
import styles from './styles';
import template from './template';

@layout(template, styles)
export default class List extends Component {
    @service analytics!: Analytics;
    @service i18n!: I18N;
    @service store!: DS.Store;
    @service toast!: Toast;

    contributors: ArrayProxy<Contributor> = this.contributors;
    node: Node = this.node;

    /**
     * Changes the contributor's permissions
     */
    updatePermissions = task(function *(this: List, contributor: HighlightableContributor, permission: Permission) {
        this.analytics.track('option', 'select', 'Collections - Submit - Change Permission');
        contributor.setProperties({ permission });

        yield this.get('saveAndHighlight').perform(contributor);
    }).enqueue();

    /**
     * Changes the contributor's bibliographic
     */
    toggleBibliographic = task(function *(this: List, contributor: HighlightableContributor) {
        const actionName = `${contributor.toggleProperty('bibliographic') ? '' : 'de'}select`;
        this.analytics.track('checkbox', actionName, 'Collections - Submit - Update Bibliographic');

        yield this.get('saveAndHighlight').perform(contributor);
    }).enqueue();

    /**
     * Changes the order of contributors for ember-sortable
     */
    reorderContributors = task(function *(
        this: List,
        contributors: HighlightableContributor[],
        contributor: HighlightableContributor,
    ) {
        const newIndex = contributors.indexOf(contributor);
        this.contributors.removeObject(contributor);
        this.contributors.insertAt(newIndex, contributor);

        contributor.set('index', newIndex);

        yield this.get('saveAndHighlight').perform(contributor);
    }).drop();

    /**
     * Saves the contributor and highlights the row with success/failure
     */
    saveAndHighlight = task(function *(this: List, contributor: HighlightableContributor): IterableIterator<any> {
        let highlightClass: typeof contributor.highlightClass;

        try {
            yield contributor.save();
            highlightClass = 'success';
        } catch (e) {
            highlightClass = 'failure';
        }

        contributor.setProperties({ highlightClass });
        yield timeout(2000);
        contributor.setProperties({ highlightClass: '' });
    });

    /**
     * Removes a contributor
     */
    removeContributor = task(function *(this: List, contributor: Contributor) {
        this.analytics.track('button', 'click', 'Collections - Submit - Remove Contributor');

        try {
            yield contributor.destroyRecord();
            this.toast.success(this.i18n.t('app_components.project_contributors.list.remove_contributor_success'));
        } catch (e) {
            this.toast.error(this.i18n.t('app_components.project_contributors.list.remove_contributor_error'));
        }

        // It's necessary to unload the record from the store after destroying it, in case the user is added back as a
        // contributor again
        this.store.unloadRecord(contributor);
    });

    /**
     * If the current user is an admin
     */
    @computed('node.currentUserPermissions')
    get isAdmin(): boolean {
        return this.node.currentUserPermissions.includes(Permission.Admin);
    }

    /**
     * Number of contributors with bibliographic
     */
    @computed('contributors.@each.bibliographic')
    get bibliographicCount(): number {
        return this.contributors.reduce((acc, { bibliographic }) => acc + +bibliographic, 0);
    }

    /**
     * Number of registered admins
     */
    @computed('contributors.@each.{unregisteredContributor,permission}')
    get adminCount(): number {
        return this.contributors.reduce(
            (acc, { permission: p, unregisteredContributor: u }) => acc + +(p === Permission.Admin && !u),
            0,
        );
    }
}
