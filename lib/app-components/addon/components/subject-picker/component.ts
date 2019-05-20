import { action } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import EmberObject, { setProperties } from '@ember/object';
import { task } from 'ember-concurrency';
import DS from 'ember-data';

import { layout } from 'ember-osf-web/decorators/component';
import Provider from 'ember-osf-web/models/provider';
import Taxonomy from 'ember-osf-web/models/taxonomy';
import Analytics from 'ember-osf-web/services/analytics';
import Theme from 'ember-osf-web/services/theme';
import defaultTo from 'ember-osf-web/utils/default-to';
import styles from './styles';
import template from './template';

interface ObjectWithId {
    [i: string]: any;
    id: string;
}

function arrayEquals(arr1: ObjectWithId[], arr2: ObjectWithId[]) {
    return arr1.length === arr2.length && arr1.every((val, i) => val.id === arr2[i].id);
}

function arrayStartsWith(arr: Taxonomy[], prefix: Taxonomy[]) {
    return prefix.reduce((acc, val, i) => acc && val && arr[i] && val.id === arr[i].id, true);
}

interface Column extends EmberObject {
    subjects: Taxonomy[];
    selection: Taxonomy | null;
}

@layout(template, styles)
export default class SubjectPicker extends Component.extend({
    didInsertElement(this: SubjectPicker, ...args: any[]) {
        this._super(...args);

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

    querySubjects: task(
        function *(
            this: SubjectPicker,
            parents: string = 'null',
            tier: number = 0,
        ): IterableIterator<any> {
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
        },
    ),
}) {
    @service analytics!: Analytics;
    @service store!: DS.Store;
    @service theme!: Theme;

    @alias('theme.provider') provider!: Provider;

    columns!: Column[];
    editMode: boolean = defaultTo(this.editMode, false);
    currentSubjects: any[] = defaultTo(this.currentSubjects, []);
    // Deep-copy the nested `currentSubjects` to `initialSubjects`.
    // Therefore any operation on `currentSubjects` will not affect `initialSubjects`.
    // So that we can restore to `initialSubjects` if needed.
    initialSubjects: any[] = this.currentSubjects.map(item => [...item]);
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

        const tempSubjects: Taxonomy[][] = this.currentSubjects.slice();
        tempSubjects.removeAt(index);
        this.set('currentSubjects', tempSubjects);
    }

    @action
    select(this: SubjectPicker, tier: number, selected: Taxonomy) {
        this.analytics.track('button', 'click', `Collections - ${this.editMode ? 'Edit' : 'Submit'} - Discipline Add`);
        // All new selected subjects are first added to `tempSubjects` before saving back to `this.currentSubjects`.
        // This is because Ember does not recognize an array model attribute as dirty
        // if we directly push objects to the array.
        const tempSubjects: Taxonomy[][] = [...this.currentSubjects];
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
        if (nextTier === totalColumns || !tempSubjects.some(item => arrayStartsWith(item, currentSelection))) {
            let existingParent;

            for (let i = 1; i <= currentSelection.length; i++) {
                const sub = currentSelection.slice(0, i);
                existingParent = tempSubjects.find(item => arrayEquals(item, sub));

                // The parent exists, append the subject to it
                if (existingParent) {
                    existingParent.pushObjects(currentSelection.slice(i));
                    break;
                }
            }

            if (!existingParent) {
                tempSubjects.pushObject(currentSelection);
            }
            this.set('currentSubjects', tempSubjects);
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
