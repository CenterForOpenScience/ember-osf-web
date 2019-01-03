import { action } from '@ember-decorators/object';
import { bool } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { task, timeout } from 'ember-concurrency';
import DS from 'ember-data';
import I18N from 'ember-i18n/services/i18n';

import { layout, requiredAction } from 'ember-osf-web/decorators/component';
import Collection from 'ember-osf-web/models/collection';
import Node from 'ember-osf-web/models/node';
import { Permission, QueryHasManyResult } from 'ember-osf-web/models/osf-model';
import CurrentUser from 'ember-osf-web/services/current-user';
import defaultTo from 'ember-osf-web/utils/default-to';
import { stripDiacritics } from 'ember-power-select/utils/group-utils';
import $ from 'jquery';
import styles from './styles';
import template from './template';

function stripAndLower(text: string): string {
    return stripDiacritics(text).toLowerCase();
}

@layout(template, styles)
export default class CollectionItemPicker extends Component.extend({
    didReceiveAttrs(this: CollectionItemPicker) {
        if (!this.get('initialLoad').hasStarted && this.collection) {
            this.get('initialLoad').perform();
        }
    },

    initialLoad: task(function *(this: CollectionItemPicker) {
        this.setProperties({
            selected: null,
            filter: '',
            page: 1,
        });

        yield this.get('findNodes').perform();
    }),

    findNodes: task(function *(this: CollectionItemPicker, filter: string = '') {
        if (filter) {
            yield timeout(250);
        }

        const { user } = this.currentUser;

        if (!user) {
            return [];
        }

        // If the filter changed, reset the page number
        if (filter !== this.filter) {
            this.setProperties({
                filter,
                page: 1,
            });
        }

        const more = this.page > 1;

        if (more) {
            this.set('loadingMore', true);
        }

        const nodes: QueryHasManyResult<Node> = yield user.queryHasMany('nodes', {
            filter: {
                current_user_permissions: Permission.Admin,
                title: this.filter ? this.filter : undefined,
            },
            page: this.page,
        });

        // Filter out nodes that are already in the current collection
        const nodeIds = nodes.mapBy('id').join();

        const params = $.param({
            'filter[id]': nodeIds,
            'fields[collected-metadata]': '', // sparse fieldset optimization (only need IDs)
        });

        const { data } = yield this.currentUser.authenticatedAJAX({
            url: `${this.collection.links.self}collected_metadata/?${params}`,
        });

        // Collected-metadata IDs are the same as node IDs
        const cgmIds: string[] = data.mapBy('id');
        const filteredNodes = nodes.filter(({ id }) => !cgmIds.includes(id));
        const { meta } = nodes;
        const hasMore = meta.total > meta.per_page * this.page;
        const items = more ? this.items.concat(filteredNodes) : filteredNodes;

        // Check if all of the nodes from the current list are in the collection
        if (!items.length && hasMore) {
            return yield this.loadMore();
        }

        this.setProperties({
            items,
            hasMore,
            loadingMore: false,
        });

        return items;
    }).restartable(),
}) {
    @service currentUser!: CurrentUser;
    @service i18n!: I18N;
    @service store!: DS.Store;

    @requiredAction projectSelected!: (value: Node) => void;
    @requiredAction validationChanged!: (isValid: boolean) => void;

    collection: Collection = this.collection;
    selected: Node | null = defaultTo(this.selected, null);
    filter: string = '';
    page: number = 1;
    hasMore: boolean = false;
    loadingMore: boolean = false;
    items: Node[] = [];

    @bool('selected') isValid!: boolean;

    /**
     * Passed into power-select component for customized searching.
     *
     * @returns results if match in node, root, or parent title
     */
    matcher(option: Node, searchTerm: string): -1 | 1 {
        const sanitizedTerm = stripAndLower(searchTerm);

        const hasTerm: boolean = [
            option.title,
            option.root && option.root.title,
            option.parent && option.parent.title,
        ].some(field => !!field && stripAndLower(field).includes(sanitizedTerm));

        return hasTerm ? 1 : -1;
    }

    @action
    valueChanged(this: CollectionItemPicker, value?: Node): void {
        if (value) {
            this.set('selected', value);
            this.projectSelected(value);
        }

        this.validationChanged(this.isValid);
    }

    @action
    loadMore(this: CollectionItemPicker): Promise<Node[]> {
        this.incrementProperty('page');

        return this.get('findNodes').perform();
    }

    @action
    oninput(this: CollectionItemPicker, term: string): true | Promise<Node[]> {
        return !!term || this.get('findNodes').perform();
    }
}
