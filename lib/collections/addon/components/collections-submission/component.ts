import { action, computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { underscore } from '@ember/string';
import { task, timeout } from 'ember-concurrency';
import DS from 'ember-data';
import I18N from 'ember-i18n/services/i18n';
import Toast from 'ember-toastr/services/toast';

import { layout, requiredAction } from 'ember-osf-web/decorators/component';
import CollectedMetadatum from 'ember-osf-web/models/collected-metadatum';
import Collection from 'ember-osf-web/models/collection';
import CollectionProvider from 'ember-osf-web/models/collection-provider';
import Guid from 'ember-osf-web/models/guid';
import Node from 'ember-osf-web/models/node';
import Analytics from 'ember-osf-web/services/analytics';
import CurrentUser from 'ember-osf-web/services/current-user';
import Theme from 'ember-osf-web/services/theme';
import defaultTo from 'ember-osf-web/utils/default-to';
import styles from './styles';
import template from './template';

enum Section {
    project = 0,
    projectMetadata = 1,
    projectContributors = 2,
    collectionSubjects = 3,
    collectionMetadata = 4,
    submit = 5,
}

@layout(template, styles)
export default class Submit extends Component {
    @service analytics!: Analytics;
    @service currentUser!: CurrentUser;
    @service i18n!: I18N;
    @service store!: DS.Store;
    @service theme!: Theme;
    @service toast!: Toast;

    readonly edit: boolean = defaultTo(this.edit, false);
    readonly provider: CollectionProvider = this.provider;
    readonly collection: Collection = this.collection;
    readonly collectedMetadatum: CollectedMetadatum = this.collectedMetadatum;

    collectionItem: Node | null = defaultTo(this.collectionItem, null);
    isProjectSelectorValid: boolean = false;
    didValidate: boolean = false;
    sections = Section;
    activeSection: Section = this.edit ? Section.projectMetadata : Section.project;
    savedSections: Section[] = this.edit ? [Section.project] : [];
    showCancelDialog: boolean = false;
    i18nKeyPrefix = 'collections.collections_submission.';

    save = task(function *(this: Submit) {
        if (!this.collectionItem) {
            return;
        }

        const validatedModels: any[] = yield Promise.all([
            this.get('collectionItem')!.validate(),
            this.get('collectedMetadatum').validate(),
        ]);

        this.set('didValidate', true);

        const invalid = validatedModels.some(({ validations: { isInvalid } }) => isInvalid);

        if (invalid) {
            return;
        }

        const guid = this.store.push({
            data: {
                id: this.collectionItem.id,
                type: 'guid',
            },
        }) as Guid;

        this.collectedMetadatum.setProperties({ guid });

        const operation = this.edit ? 'update' : 'add';

        try {
            yield this.collectedMetadatum.save();

            this.collectionItem.set('collectable', false);

            this.toast.success(this.i18n.t(`${this.i18nKeyPrefix}${operation}_save_success`, {
                title: this.collectionItem.title,
            }));

            yield timeout(1000);

            // TODO: external-link-to / waffle for project main page
            window.location.href = this.collectionItem.links.html;
        } catch (e) {
            this.toast.error(this.i18n.t(`${this.i18nKeyPrefix}${operation}_save_error`, {
                title: this.collectionItem.title,
                error: e.errors[0].detail,
            }));
        }
    }).drop();

    @computed('collectedMetadatum.displayChoiceFields')
    get choiceFields(): Array<{ label: string; value: string; }> {
        return this.collectedMetadatum.displayChoiceFields
            .map(field => ({
                label: `collections.collection_metadata.${underscore(field)}_label`,
                value: this.collectedMetadatum[field],
            }));
    }

    /**
     * Leaves the current route for the discover route (currently home for collections)
     */
    @requiredAction
    transition!: () => void;

    @action
    projectSelected(this: Submit, collectionItem: Node) {
        collectionItem.set('collectable', true);

        this.setProperties({
            collectionItem,
        });

        this.nextSection();
    }

    /**
     * Reset for the cancel modal
     */
    @action
    reset(this: Submit) {
        this.collectedMetadatum.rollbackAttributes();

        this.setProperties({
            activeSection: Section.project,
            savedSections: [],
            showCancelDialog: false,
        });

        this.transition();
    }

    /**
     * Cancel action for the entire form (bottom of the page). Navigates away if a project has not been selected.
     * Otherwise, shows the confirmation dialog
     */
    @action
    cancel(this: Submit) {
        if (this.activeSection === Section.project) {
            this.transition();
            return;
        }

        this.set('showCancelDialog', true);
    }

    @action
    noop() {
        // Nothing to see here
    }

    @action
    nextSection() {
        this.savedSections.pushObject(this.activeSection);
        this.incrementProperty('activeSection');
    }
}
