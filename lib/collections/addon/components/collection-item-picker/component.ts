import Store from '@ember-data/store';
import Component from '@ember/component';
import { action } from '@ember/object';
import { bool } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import { restartableTask, task, timeout } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import { stripDiacritics } from 'ember-power-select/utils/group-utils';

import { layout, requiredAction } from 'ember-osf-web/decorators/component';
import Collection from 'ember-osf-web/models/collection';
import Node from 'ember-osf-web/models/node';
import { Permission } from 'ember-osf-web/models/osf-model';
import CurrentUser from 'ember-osf-web/services/current-user';
import { CollectionSubmissionReviewStates } from 'ember-osf-web/models/collection-submission';

import styles from './styles';
import template from './template';

function stripAndLower(text: string): string {
    return stripDiacritics(text).toLowerCase();
}

@layout(template, styles)
export default class CollectionItemPicker extends Component {
    @service currentUser!: CurrentUser;
    @service store!: Store;

    @requiredAction projectSelected!: (value: Node) => void;
    @requiredAction validationChanged!: (isValid: boolean) => void;

    collection!: Collection;
    selected: Node | null = null;
    filter = '';
    page = 1;
    hasMore = false;
    loadingMore = false;
    items: Node[] = [];

    @bool('selected') isValid!: boolean;

    @task
    @waitFor
    async initialLoad() {
        this.setProperties({
            selected: null,
            filter: '',
            page: 1,
        });

        await taskFor(this.findNodes).perform();
    }

    @restartableTask
    @waitFor
    async findNodes(filter = '') {
        if (filter) {
            await timeout(250);
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

        const nodes = await user.queryHasMany('nodes', {
            filter: {
                current_user_permissions: Permission.Admin,
                title: this.filter ? this.filter : undefined,
            },
            page: this.page,
        });

        // Filter out nodes that are already in the current collection
        const nodeIds = nodes.mapBy('id').join();
        // making two calls since the API doesn't    OR filtering yet
        const cgmAccepted = await this.collection.queryHasMany('collectionSubmissions', {
            filter: {
                id: nodeIds,
                reviews_state: CollectionSubmissionReviewStates.Accepted,
            },
        });
        const cgmPending = await this.collection.queryHasMany('collectionSubmissions', {
            filter: {
                id: nodeIds,
                reviews_state: CollectionSubmissionReviewStates.Pending,
            },
        });
        const cgm = cgmAccepted.concat(cgmPending);

        // Collection-submissions IDs are the same as node IDs
        const cgmCompoundIds: string[] = cgm.mapBy('id');
        const cgmSimpleIds: string[] = cgmCompoundIds.map(id => id.split('-')[1]);
        const filteredNodes = nodes.filter(({ id }) => !cgmSimpleIds.includes(id));
        const { meta } = nodes;
        const hasMore = meta.total > meta.per_page * this.page;
        const items = more ? this.items.concat(filteredNodes) : filteredNodes;

        // Check if all of the nodes from the current list are in the collection
        if (!items.length && hasMore) {
            const moreNodes = await this.loadMore();
            return moreNodes;
        }

        this.setProperties({
            items,
            hasMore,
            loadingMore: false,
        });

        return items;
    }

    /**
     * Passed into power-select component for customized searching.
     *
     * @returns results if match in node, root, or parent title
     */
    matcher(option: Node, searchTerm: string): -1 | 1 {
        const sanitizedTerm = stripAndLower(searchTerm);

        const hasTerm = [
            option.title,
            option.root && option.root.title,
            option.parent && option.parent.title,
        ].some(field => !!field && stripAndLower(field).includes(sanitizedTerm));

        return hasTerm ? 1 : -1;
    }

    @action
    valueChanged(value?: Node): void {
        if (value) {
            this.set('selected', value);
            this.projectSelected(value);
        }

        this.validationChanged(this.isValid);
    }

    @action
    loadMore(this: CollectionItemPicker): Promise<Node[]> {
        this.incrementProperty('page');

        return taskFor(this.findNodes).perform();
    }

    @action
    oninput(this: CollectionItemPicker, term: string): true | Promise<Node[]> {
        return !!term || taskFor(this.findNodes).perform();
    }

    didReceiveAttrs() {
        if (!taskFor(this.initialLoad).isRunning && this.collection) {
            taskFor(this.initialLoad).perform();
        }
    }
}
