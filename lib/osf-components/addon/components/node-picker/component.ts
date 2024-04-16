import Component from '@glimmer/component';
import Store from '@ember-data/store';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import { restartableTask, timeout } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import { stripDiacritics } from 'ember-power-select/utils/group-utils';
import Node from 'ember-osf-web/models/node';
import CurrentUser from 'ember-osf-web/services/current-user';
import { tracked } from '@glimmer/tracking';

function stripAndLower(text: string): string {
    return stripDiacritics(text).toLowerCase();
}

/**
 * The node picker args
 */
interface NodePickerArgs {
    projectSelected: (value: Node) => void;
}

export default class NodePicker extends Component<NodePickerArgs> {
    @service currentUser!: CurrentUser;
    @service store!: Store;

    selected: Node | null = null;
    filter = '';
    page = 1;
    @tracked hasMore = false;
    @tracked loadingMore = false;
    @tracked items: Node[] = [];

    constructor(owner: unknown, args: NodePickerArgs) {
        super(owner, args);

        this.selected = null;
        this.filter = '';
        this.page = 1;

        taskFor(this.findNodes).perform();
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
            this.filter = filter;
            this.page = 1;
        }

        const more = this.page > 1;

        if (more) {
            this.loadingMore = true;
        }

        const nodes = await user.queryHasMany('nodes', {
            filter: {
                title: this.filter ? this.filter : undefined,
            },
            page: this.page,
        });

        const { meta } = nodes;
        this.hasMore = meta.total > meta.per_page * this.page;
        const items = more ? this.items.concat(nodes) : nodes;

        this.items = items;
        this.loadingMore = false;

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
            this.selected = value;
            this.args.projectSelected(value);
        }
    }

    @action
    loadMore(this: NodePicker): Promise<Node[]> {
        this.page += 1;

        return taskFor(this.findNodes).perform();
    }

    @action
    oninput(this: NodePicker, term: string): true | Promise<Node[]> {
        return !!term || taskFor(this.findNodes).perform();
    }
}
