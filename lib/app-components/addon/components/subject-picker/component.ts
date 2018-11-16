
import { action } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import EmberObject, { setProperties } from '@ember/object';
import { task } from 'ember-concurrency';
import DS from 'ember-data';
import Provider from 'ember-osf-web/models/provider';
import Taxonomy from 'ember-osf-web/models/taxonomy';
import Analytics from 'ember-osf-web/services/analytics';
import Theme from 'ember-osf-web/services/theme';
import defaultTo from 'ember-osf-web/utils/default-to';
import styles from './styles';
import layout from './template';

function arrayEquals<T>(arr1: T[], arr2: T[]) {
    return arr1.length === arr2.length && arr1.reduce((acc, val, i) => acc && val === arr2[i], true);
}

function arrayStartsWith(arr: Taxonomy[], prefix: Taxonomy[]) {
    return prefix.reduce((acc, val, i) => acc && val && arr[i] && val.id === arr[i].id, true);
}

interface Column extends EmberObject {
    subjects: Taxonomy[];
    selection: Taxonomy | null;
}

export default class SubjectPicker extends Component.extend({
    didInsertElement(this: SubjectPicker, ...args: any[]) {
        this._super(...args);

        if (this.currentSubjects) {
            this.set('initialSubjects', [...this.currentSubjects]);
        }

        this.setProperties({
            hasChanged: false,
            columns: new Array(3)
                .fill(null)
                .map((): Column => EmberObject.create({
                    subjects: [],
                    selection: null,
                })),
        });

        this.get('querySubjects').perform();
    },

    querySubjects: task(function *(this: SubjectPicker, parents = 'null', tier = 0): IterableIterator<any> {
        const column: Column = this.columns.objectAt(tier)!;

        const taxonomies: Taxonomy[] = yield this.provider.queryHasMany('taxonomies', {
            filter: {
                parents,
            },
            page: {
                size: 150, // Law category has 117 (Jan 2018)
            },
        });

        column.set('subjects', taxonomies ? taxonomies.toArray() : []);
    }),
}) {
    layout = layout;
    styles = styles;

    @service analytics!: Analytics;
    @service store!: DS.Store;
    @service theme!: Theme;

    @alias('theme.provider') provider!: Provider;

    columns!: Column[];
    editMode: boolean = defaultTo(this.editMode, false);
    initialSubjects: any[] = [];
    currentSubjects: any[] = this.currentSubjects;
    hasChanged: boolean = false;

    resetColumnSelections() {
        this.columns.forEach((column, i) => {
            setProperties(column, {
                subjects: i < 1 ? column.subjects : [],
                selection: null,
            });
        });
    }

    @action
    deselect(this: SubjectPicker, index: number) {
        this.analytics.track(
            'button',
            'click',
            `Collections - ${this.editMode ? 'Edit' : 'Submit'} - Discipline Remove`,
        );

        this.set('hasChanged', true);
        this.resetColumnSelections();

        this.currentSubjects.removeAt(index);
    }

    @action
    select(this: SubjectPicker, tier: number, selected: Taxonomy) {
        this.analytics.track('button', 'click', `Collections - ${this.editMode ? 'Edit' : 'Submit'} - Discipline Add`);

        if (!this.currentSubjects) {
            this.set('currentSubjects', []);
        }

        this.set('hasChanged', true);
        const column = this.columns[tier];

        // Bail out if the subject is already selected
        if (column.selection === selected) {
            return;
        }

        column.set('selection', selected);

        const totalColumns = this.columns.length;
        const nextTier = tier + 1;

        const currentSelection: Taxonomy[] = this.columns
            .slice(0, nextTier)
            .map(({ selection }) => selection!);

        // An existing tag has this prefix, and this is the lowest level of the taxonomy, so no need to fetch child
        // results
        if (nextTier === totalColumns || !this.currentSubjects.some(item => arrayStartsWith(item, currentSelection))) {
            let existingParent;

            for (let i = 1; i <= currentSelection.length; i++) {
                const sub = currentSelection.slice(0, i);
                existingParent = this.currentSubjects.find(item => arrayEquals(item, sub));

                // The parent exists, append the subject to it
                if (existingParent) {
                    existingParent.pushObjects(currentSelection.slice(i));
                    break;
                }
            }

            if (!existingParent) {
                this.currentSubjects.pushObject(currentSelection);
            }
        }

        // Bail out if we're at the last column.
        if (nextTier === totalColumns) {
            return;
        }

        for (let i = nextTier; i < totalColumns; i++) {
            this.columns.objectAt(i)!.set('subjects', []);
        }

        if (selected.childCount) {
            this.get('querySubjects').perform(selected.id, nextTier);
        }
    }

    @action
    discard(this: SubjectPicker) {
        this.analytics.track(
            'button',
            'click',
            `Collections - ${this.editMode ? 'Edit' : 'Submit'} - Discard Discipline Changes`,
        );

        this.resetColumnSelections();

        this.setProperties({
            currentSubjects: [...this.initialSubjects],
            hasChanged: false,
        });
    }
}
