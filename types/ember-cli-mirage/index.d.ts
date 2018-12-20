import { Document } from 'osf-api';

export { default as faker } from 'faker';

declare global {
    const server: Server; // TODO: only in tests?
}

export type ID = number | string;

interface AnyAttrs {
    [key: string]: any;
}

type Record < T > = T & { id: ID };

export interface DatabaseCollection<T = AnyAttrs> {
    insert<S extends T | T[]>(data: S): S extends T ? Record<T> : Array<Record<T>>;
    find<S extends ID | ID[]>(ids: S): S extends ID ? Record<T> : Array<Record<T>>;
    findBy(query: T): Record<T>;
    where(query: T | ((r: Record<T>) => boolean)): Array<Record<T>>;
    update(attrs: T): Array<Record<T>>;
    update(target: ID | T, attrs: T): Array<Record<T>>;
    remove(target?: ID | T): void;
    firstOrCreate(query: T, attributesForCreate?: T): Record<T>;
}

export interface Database {
    createCollection(name: string): void;
    [collectionName: string]: DatabaseCollection;
}

export type Model<T> = {
    [P in keyof T]: T[P] & { models: any[] };
};

interface ModelInstanceShared<T> {
    id: ID;
    attrs: T;
    schema: Schema;

    save(): void;
    update<K extends keyof T>(key: K, val: T[K]): void;
    update<K extends keyof T>(attrs: { [key: K]: T[K] }): void;
    destroy(): void;
    isNew(): boolean;
    isSaved(): boolean;
    reload(): void;
    toString(): string;
}

export type ModelInstance<T = AnyAttrs> = ModelInstanceShared<T> & Model<T>;

interface Collection<T> {
    models: Array<ModelInstance<T>>;
    modelName: string;
    update<K extends keyof T>(key: K, val: T[K]): void;
    save(): void;
    reload(): void;
    destroy(): void;
    sort(sortFn: (a: ModelInstance<T>, b: ModelInstance<T>) => number): Collection<T>;
    filter(filterFn: (model: ModelInstance<T>) => boolean): Collection<T>;
}

interface ModelClass<T = AnyAttrs> {
    new(attrs: T): ModelInstance<T>;
    create(attrs: T): ModelInstance<T>;
    update(attrs: T): ModelInstance<T>;
    all(): Collection<T>;
    find<S extends ID | ID[]>(ids: S): S extends ID ? ModelInstance<T> : Collection<T>;
    findBy(query: T): ModelInstance<T>;
    first(): ModelInstance<T>;
    where(query: T | ((r: ModelInstance<T>) => boolean)): Collection<T>;
}

export interface Schema {
    db: Database;
    [modelName: string]: ModelClass;
}

export declare class Response {
    constructor(code: number, headers: Record<string, string>, body: any);
}

export interface Request {
    requestBody: any;
    url: string;
    params: {
        [key: string]: string | number,
    };
    queryParams: {
        [key: string]: string,
    };
}

export interface HandlerContext {
    request: Request;
    serialize(modelOrCollection: ModelInstance | ModelInstance[] | ModelClass, serializerName?: string): any;
    normalizedRequestAttrs(): any;
}
interface HandlerObject {
    [k: string]: any;
}
interface HandlerOptions {
    timing?: number;
    coalesce?: boolean;
}
type HandlerFunction = (this: HandlerContext, schema: Schema, request: Request) => any;

/* tslint:disable unified-signatures */
function handlerDefinition(path: string, options?: HandlerOptions): void;
function handlerDefinition(
    path: string,
    shorthand: string | string[],
    options?: HandlerOptions,
): void;
function handlerDefinition(
    path: string,
    shorthand: string | string[],
    responseCode: number,
    options?: HandlerOptions,
): void;
function handlerDefinition(
    path: string,
    responseCode?: number,
    options?: HandlerOptions,
): void;
function handlerDefinition(
    path: string,
    handler: HandlerFunction | HandlerObject,
    options?: HandlerOptions,
): void;
function handlerDefinition(
    path: string,
    handler: HandlerFunction | HandlerObject,
    responseCode: number,
    options?: HandlerOptions,
): void;
/* tslint:enable unified-signatures */

export type resourceAction = 'index' | 'show' | 'create' | 'update' | 'delete';

export interface Server {
    schema: Schema;
    db: Database;

    namespace: string;
    timing: number;
    logging: boolean;
    pretender: any;
    urlPrefix: string;

    get: typeof handlerDefinition;
    post: typeof handlerDefinition;
    put: typeof handlerDefinition;
    patch: typeof handlerDefinition;
    del: typeof handlerDefinition;

    resource(
        resourceName: string,
        options?: { only?: resourceAction[], except?: resourceAction[], path?: string },
    ): void;

    loadFixtures(...fixtures: string[]): void;

    // TODO when https://github.com/Microsoft/TypeScript/issues/1360
    // passthrough(...paths: string[], verbs?: Verb[]): void;
    passthrough(...args: any[]): void;

    create<T extends AnyAttrs = AnyAttrs>(
        modelName: string,
        ...traits: string[],
    ): ModelInstance<T>;
    create<T extends AnyAttrs = AnyAttrs>(
        modelName: string,
        attrs?: Partial<T>,
        ...traits: string[],
    ): ModelInstance<T>;

    createList<T extends AnyAttrs = AnyAttrs>(
        modelName: string,
        amount: number,
        ...traits: string[],
    ): Array<ModelInstance<T>>;
    createList<T extends AnyAttrs = AnyAttrs>(
        modelName: string,
        amount: number,
        attrs?: Partial<T>,
        ...traits: string[],
    ): Array<ModelInstance<T>>;

    shutdown(): void;
}

export type TraitOptions = AnyAttrs & {
    afterCreate?: (obj: ModelInstance<AnyAttrs>, svr: Server) => void,
};

export interface Trait<O extends TraitOptions = {}> {
    extension: O;
    __isTrait__: true;
}

export function trait<O extends TraitOptions>(options: O): Trait<O>;

// TODO when https://github.com/Microsoft/TypeScript/issues/1360
// function association(...traits: string[], overrides?: { [key: string]: any }): any;
export function association(...args: any[]): any;

export type FactoryAttrs<T> = {
    [P in keyof T]?: T[P] | ((index: number) => T[P]);
} & {
    afterCreate?(newObj: any, server: Server): void;
};

export class FactoryClass {
    extend<T>(attrs: FactoryAttrs<T>): FactoryClass;
}

export const Factory: FactoryClass;

export class JSONAPISerializer {
    request!: Request;

    keyForAttribute(attr: string): string;
    keyForCollection(modelName: string): string;
    keyForModel(modelName: string): string;
    keyForRelationship(relationship: string): string;
    typeKeyForModel(model: ModelInstance): string;

    serialize(object: ModelInstance, request: Request): SingleResourceDocument;
    normalize(json: any): any;
}
