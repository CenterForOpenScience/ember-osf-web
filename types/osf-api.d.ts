/* eslint-disable no-use-before-define,camelcase */

import * as JSONAPI from 'jsonapi-typescript';

export type Document = DataDocument | ErrorDocument;

export type DataDocument = SingleResourceDocument | ResourceCollectionDocument;

export interface ErrorDocument extends DocBase {
    errors: JSONAPI.Errors;
}

export interface SingleResourceDocument extends DocBase {
    data: Resource;
}

export interface ResourceCollectionDocument extends DocBase {
    data: Resource[];
    meta: PaginatedMeta;
}

export interface DocBase extends JSONAPI.DocBase {
    meta: BaseMeta;
}

export interface PaginatedMeta extends BaseMeta {
    total: number;
    per_page: number;
}

export interface BaseMeta {
    version: string;
    total_bibliographic?: number;
}

export interface Resource extends JSONAPI.ResourceObject {
    id: string | number;
    relationships?: Relationships;
    embeds?: Embeds;
}

export interface Relationships {
    [k: string]: Relationship;
}

export interface Embeds {
    [k: string]: DataDocument;
}

export type Relationship = RelationshipWithData | RelationshipWithLinks;

export interface RelationshipWithData {
    data: JSONAPI.ResourceLinkage;
}

export interface RelationshipWithLinks {
    links: RelatedLink;
}

export interface RelatedLink {
    related: {
        href: string;
        meta: RelatedLinkMeta;
    };
}

export interface RelatedLinkMeta {
    count?: number;
}

/* eslint-enable no-use-before-define,camelcase */
