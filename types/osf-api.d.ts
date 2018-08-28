/* eslint-disable no-use-before-define,camelcase */

import * as JSON from 'json-typescript';
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
    activeFlags: string[];
    message: string;
    current_user?: { data: UserResource };
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
    count?: number;
}

/* eslint-enable no-use-before-define,camelcase */
