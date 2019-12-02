import Service from '@ember/service';
import { is, Map, OrderedSet, ValueObject } from 'immutable';
import $ from 'jquery';

// Used later on for slightly stricter typing of immutable Maps
// Records don't conform to the same interface as Map, so it may not be used as
// a key in other Maps
export interface TypedMap<T> extends Map<keyof T, T[keyof T]> {
    get<K extends keyof T>(key: K): T[K] | undefined;
    set<K extends keyof T>(key: K, value: T[K]): this;
}

export class MapProxy<T> implements ValueObject {
    public readonly internal: TypedMap<T>;

    get hashable(): TypedMap<T> {
        return this.internal;
    }

    constructor(values: T) {
        this.internal = Map(Object.entries(values)) as TypedMap<T>;
    }

    equals(other: any): boolean {
        return this.internal.equals(other instanceof MapProxy ? other.hashable : other);
    }

    hashCode(): number {
        return this.internal.hashCode();
    }

    differingKeys(other: MapProxy<T>): Array<keyof T> {
        return Array.from(this.internal.filter(
            (val, key) => !is(val, other.internal.get(key)),
        ).keys());
    }
}

interface Filter {
   key: string;
   type: symbol;
   display: string;
   value: string | number | boolean;
}

interface Order {
    display: string;
    key?: string;
    ascending: boolean;
}

interface Options {
    filters: OrderedSet<SearchFilter>;
    modifiers: OrderedSet<SearchModifier>;
    order: SearchOrder;
    page: number;
    query?: string;
    size: number;
}

export interface SearchModifier extends ValueObject {
    apply(query: any): any;
}

export class SearchOrder extends MapProxy<Order> implements Order {
    get display() {
        return this.internal.get('display')!;
    }

    get key() {
        return this.internal.get('key');
    }

    get ascending() {
        return this.internal.get('ascending')!;
    }
}

export abstract class SearchFilter extends MapProxy<Filter> implements Filter, SearchModifier {
    get key() {
        return this.internal.get('key')!;
    }

    get type() {
        return this.internal.get('type')!;
    }

    get display() {
        return this.internal.get('display')!;
    }

    get value() {
        return this.internal.get('value')!;
    }

    abstract apply(query: any): any;
}

export class SearchOptions extends MapProxy<Options> implements Options {
    static defaults: Options = {
        filters: OrderedSet(),
        modifiers: OrderedSet(),
        order: new SearchOrder({
            ascending: true,
            display: 'registries.discover.order.relevance',
            key: undefined,
        }),
        page: 1,
        query: undefined,
        size: 10,
    };

    get order(): SearchOrder {
        return this.internal.get('order')!;
    }

    get page(): number {
        return this.internal.get('page')!;
    }

    get size(): number {
        return this.internal.get('size')!;
    }

    get query(): string | undefined {
        return this.internal.get('query');
    }

    get filters() {
        return this.internal.get('filters')!;
    }

    get modifiers() {
        return this.internal.get('modifiers')!;
    }

    constructor(values: Partial<Options>) {
        super(Object.assign({}, SearchOptions.defaults, values));
    }

    set<K extends keyof Options>(key: K, value: Options[K]) {
        return new SearchOptions(this.internal.set(key, value).toObject());
    }

    addFilters(...filters: SearchFilter[]) {
        return new SearchOptions(this.internal.set('filters', this.filters.concat(filters)).toObject());
    }

    removeFilters(...filters: SearchFilter[]) {
        return new SearchOptions(this.internal.set('filters', this.filters.subtract(filters)).toObject());
    }
}

export interface SearchResults<T> {
    results: T[];
    aggregations: {[key: string]: any};
    total: number;
}

export default abstract class AbstractSearchService extends Service {
    abstract url(options: SearchOptions): string;
    abstract extractTotal(response: any): number;
    abstract buildQuery(options: SearchOptions): {[key: string]: any};

    extractAggregations(response: any): {[key: string]: any} {
        return response ? {} : {};
    }

    async search<T>(options: SearchOptions, postProcess: (x: any) => T[]): Promise<SearchResults<T>> {
        const response = await $.ajax({
            type: 'POST',
            crossDomain: true,
            url: this.url(options),
            contentType: 'application/json',
            data: JSON.stringify(this.buildQuery(options)),
        });

        return {
            aggregations: this.extractAggregations(response),
            results: postProcess(response),
            total: this.extractTotal(response),
        };
    }
}
