import { RelationshipsFor } from 'ember-data';
import OsfModel from 'ember-osf-web/models/osf-model';

/**
 * Create an async generator that yields a lists of related models.
 *
 * Note: This generator makes use of the return statement to indicate the final
 * value without requiring an additional "spin". This always buttons like "Show more"
 * to avoid having a final empty page or having to prefetch the next page. In practice,
 * this means using an await for ... of loop will result in missing the final set of results.
 * Instead, prefer while or for loops for iteration.
 */
export async function *hasManyIterator<
T extends OsfModel
>(model: T, relatedName: RelationshipsFor<T>, pageSize: number = 10) {
    if (model.relatedCounts[relatedName] === 0) {
        return [];
    }

    // eslint-disable-next-line no-await-in-loop
    for (let page = 1; ; page++) {
        const related = await model.queryHasMany(relatedName, { page, 'page[size]': pageSize });

        if (related.length < pageSize) {
            return related;
        } else {
            yield related;
        }
    }
}

/**
 * Chain together two generators/iterators that yield lists of items.
 *
 * Note: This generator makes use of the return statement to indicate the final
 * value without requiring an additional "spin". This always buttons like "Show more"
 * to avoid having a final empty page or having to prefetch the next page. In practice,
 * this means using an await for ... of loop will result in missing the final set of results.
 * Instead, prefer while or for loops for iteration.
 */
export async function *chainPages<T, O>(
    gen1: AsyncIterator<T[]>,
    gen2: AsyncIterator<O[]>,
    pageSize: number = 10,
): AsyncIterableIterator<Array<T | O>> {
    let yieldable: Array<T | O> = [];

    // eslint-disable-next-line no-await-in-loop
    while (true) {
        const result = await gen1.next();

        if (result.value !== undefined) {
            yieldable.push(...result.value);
        }

        if (yieldable.length >= pageSize) {
            yield yieldable.slice(0, pageSize);
            yieldable = yieldable.slice(pageSize);
        }

        if (result.done) {
            break;
        }
    }

    // eslint-disable-next-line no-await-in-loop
    while (true) {
        const result = await gen2.next();

        if (result.value !== undefined) {
            yieldable.push(...result.value);
        }

        // Kinda redundant check to avoid having a final yield of []
        if (result.done && yieldable.length === pageSize) {
            return yieldable;
        } else if (yieldable.length >= pageSize) {
            yield yieldable.slice(0, pageSize);
            yieldable = yieldable.slice(pageSize);
        }

        if (result.done) {
            return yieldable;
        }
    }
}

/*
 * Memoizes a generator such that repeated iterations do not result in repeated calls
 * to the underlying generator. Useful for components that don't store state.
 *
 * Note: This generator makes use of the return statement to indicate the final
 * value without requiring an additional "spin". This always buttons like "Show more"
 * to avoid having a final empty page or having to prefetch the next page. In practice,
 * this means using an await for ... of loop will result in missing the final set of results.
 * Instead, prefer while or for loops for iteration.
 */
export function memoize<T>(generator: AsyncIterator<T>): () => AsyncIterableIterator<T> {
    const values: Array<IteratorResult<T>> = [];

    return async function *() {
        for (const result of values) {
            if (result.done) {
                return result.value;
            } else {
                yield result.value;
            }
        }

        // eslint-disable-next-line no-await-in-loop
        while (true) {
            const result = await generator.next();
            values.push(result);

            if (result.done) {
                return result.value;
            } else {
                yield result.value;
            }
        }
    };
}
