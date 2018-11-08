import { layout, tagName } from '@ember-decorators/component';
import { action, computed } from '@ember-decorators/object';
import { A } from '@ember/array';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import { task } from 'ember-concurrency';
import defaultTo from 'ember-osf-web/utils/default-to';
import template from './template';

@tagName('')
@layout(template)
export default class IncrementalLoad<T> extends Component {
    generator!: () => AsyncIterator<T[]>;
    items: T[] = defaultTo(this.items, A([]));
    hasMore: boolean = defaultTo(this.hasMore, false);

    generatorInstance!: AsyncIterator<T[]>;

    @computed('items.length', 'loadItems.isRunning')
    get isEmpty(): boolean {
        return this.items.length === 0 && !this.get('loadItems').isRunning;
    }

    loadItems = task(function *(this: IncrementalLoad<T>) {
        const result: IteratorResult<T[]> = yield this.generatorInstance.next();

        this.set('hasMore', !result.done);
        this.items.pushObjects(result.value);
    });

    didReceiveAttrs() {
        this.set('items', A([]));
        this.set('hasMore', false);
        this.set('generatorInstance', this.generator());

        assert(
            '@generator must be shaped like an AsyncIterator',
            typeof this.generatorInstance.next === 'function',
        );

        this.get('loadItems').perform();
    }

    @action
    loadMore() {
        this.get('loadItems').perform();
    }
}
