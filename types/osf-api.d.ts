/* eslint-disable camelcase */

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

export interface RootDocument extends DocBase {
    meta: RootMeta;
}

export interface DocBase extends JSONAPI.DocBase {
    meta: BaseMeta;
}

export interface PaginatedMeta extends BaseMeta {
    total: number;
    per_page: number;
}

export interface RootMeta extends BaseMeta {
    active_flags: string[];
    message: string;
    version: string;
    current_user?: {
        data: UserResource,
        meta?: {
            anonymous?: boolean;
        },
    };
}

export interface BaseMeta {
    version: string;
    total_bibliographic?: number;
    anonymous?: boolean;
}

export interface Resource extends JSONAPI.ResourceObject {
    id: string | number;
    relationships?: Relationships;
    embeds?: Embeds;
    links?: NormalLinks;
}

export interface UserResource extends Resource {
    links: JSONAPI.Links & { profile_image: string };
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
    links: RelationshipLinks;
}

export interface RelationshipLinks extends JSONAPI.Links {
    related: RelatedLink;
}

export type RelatedLink = string | { href: string; meta?: RelatedLinkMeta };

export interface RelatedLinkMeta {
    id?: string;
    count?: number;
    type?: string;
}

export interface NormalLinks extends JSONAPI.Links {
    self?: JSONAPI.Link;
    html?: JSONAPI.Link;
}
/* eslint-enable camelcase */
