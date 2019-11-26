import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { underscore } from '@ember/string';
import { timeout } from 'ember-concurrency';
import { task } from 'ember-concurrency-decorators';
import DS from 'ember-data';
import I18N from 'ember-i18n/services/i18n';
import Toast from 'ember-toastr/services/toast';

import { layout, requiredAction } from 'ember-osf-web/decorators/component';
import CollectedMetadatum from 'ember-osf-web/models/collected-metadatum';
import Collection from 'ember-osf-web/models/collection';
import CollectionProvider from 'ember-osf-web/models/collection-provider';
import Node from 'ember-osf-web/models/node';
import Analytics from 'ember-osf-web/services/analytics';
import CurrentUser from 'ember-osf-web/services/current-user';
import Theme from 'ember-osf-web/services/theme';
import defaultTo from 'ember-osf-web/utils/default-to';
import getHref from 'ember-osf-web/utils/get-href';
import styles from './styles';
import template from './template';

enum Section {
    project = 0,
    projectMetadata = 1,
    projectContributors = 2,
    collectionMetadata = 3,
    submit = 4,
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
    sections = Section;
    activeSection: Section = this.edit ? Section.projectMetadata : Section.project;
    savedSections: Section[] = this.edit ? [
        Section.project,
        Section.projectMetadata,
        Section.projectContributors,
        Section.collectionMetadata,
    ] : [];
    showCancelDialog: boolean = false;
    i18nKeyPrefix = 'collections.collections_submission.';
    showSubmitModal: boolean = false;

    @task({ drop: true })
    save = task(function *(this: Submit) {
        if (!this.collectionItem) {
            return;
        }

        const validatedModels: any[] = yield Promise.all([
            this.get('collectionItem')!.validate(),
            this.get('collectedMetadatum').validate(),
        ]);

        const invalid = validatedModels.some(({ validations: { isInvalid } }) => isInvalid);

        if (invalid) {
            return;
        }

        this.collectedMetadatum.set('guid', this.collectionItem);

        const operation = this.edit ? 'update' : 'add';

        try {
            if (!this.collectionItem.public) {
                this.collectionItem.set('public', true);
                yield this.collectionItem.save();
            }
            yield this.collectedMetadatum.save();

            this.collectionItem.set('collectable', false);

            this.toast.success(this.i18n.t(`${this.i18nKeyPrefix}${operation}_save_success`, {
                title: this.collectionItem.title,
            }));

            yield timeout(1000);
            this.resetPageDirty();
            // TODO: external-link-to / waffle for project main page
            window.location.href = getHref(this.collectionItem.links.html!);
        } catch (e) {
            this.toast.error(this.i18n.t(`${this.i18nKeyPrefix}${operation}_save_error`, {
                title: this.collectionItem.title,
                error: e.errors[0].detail,
            }));
        }
    });

    @computed('collectedMetadatum.{displayChoiceFields,collectedType,issue,volume,programArea,status}')
    get choiceFields(): Array<{ label: string; value: string | undefined; }> {
        return this.collectedMetadatum.displayChoiceFields
            .map(field => ({
                name: field,
                label: `collections.collection_metadata.${underscore(field)}_label`,
                value: this.collectedMetadatum[field],
            }));
    }

    /**
     * Leaves the current route for the discover route (currently home for collections)
     */
    @requiredAction
    transition!: () => void;

    /**
     * Called when user advances to the next section
     */
    @requiredAction
    onNextSection!: () => void;

    /**
     * Called to reset isPageDirty
     */
    @requiredAction
    resetPageDirty!: () => void;

    @action
    projectSelected(collectionItem: Node) {
        collectionItem.set('collectable', true);

        this.setProperties({
            collectionItem,
        });

        this.nextSection();
    }

    /**
     * Cancel action for the entire form (bottom of the page). Navigates away if a project has not been selected.
     */
    @action
    cancel() {
        this.transition();
    }

    /**
     * Sets showSubmitModal, a property when set will cause the collection-submission-confirmation-modal to be shown
     */
    @action
    setShowSubmitModal() {
        this.set('showSubmitModal', true);
    }

    /**
     * Resets showSubmitModal
     */
    @action
    resetShowSubmitModal() {
        this.set('showSubmitModal', false);
    }

    @action
    noop() {
        // Nothing to see here
    }

    @action
    onAddContributor() {
        if (this.collectionItem) {
            this.collectionItem.hasMany('bibliographicContributors').reload();
        }
    }

    /**
     * Advances to the next section of the form
     */
    @action
    nextSection() {
        this.savedSections.pushObject(this.activeSection);
        this.incrementProperty('activeSection');
        this.onNextSection();
    }
}
