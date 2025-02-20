import { attr, belongsTo, AsyncBelongsTo } from '@ember-data/model';
import RegistrationModel from 'ember-osf-web/models/registration';
import { Link } from 'jsonapi-typescript';

import NodeModel from './node';
import OsfModel from './osf-model';
import UserModel, { UserLinks } from './user';

export interface LogParamNodeModel {
    id: string;
    title: string;
}

export interface LogParamUrls {
    view: Link;
    download: Link;
}

export interface LogParamIdentifiersModel {
    doi?: string;
    ark?: string;
}

export interface LogParamNameUrlModel {
    name: string;
    url: string;
}

export interface LogParamInstitutionModel {
    id: string;
    name: string;
}

export interface LogParamSourceModel {
    materialized: string;
    addon: string;
    url: string;
}


export interface LogParamModel {
    addon: string;
    anonymousLink: boolean;
    contributors: string[];
    destination: LogParamSourceModel;
    file: LogParamNameUrlModel;
    githubUser: string;
    guid: string;
    identifiers: LogParamIdentifiersModel;
    institution: LogParamInstitutionModel;
    kind: string;
    license: string;
    pageId: string;
    page: string;
    oldPage: string;
    paramsNode: LogParamNodeModel;
    paramsProject: string;
    path: string;
    pathType: string;
    pointer: string;
    preprint: string;
    preprintProvider: LogParamNameUrlModel;
    source: LogParamSourceModel;
    tag: string;
    titleNew: string;
    titleOriginal: string;
    urls: UserLinks;
    version: string;
    wiki: LogParamNameUrlModel;
}

export default class LogModel extends OsfModel {
    @attr('date') date!: Date;
    @attr('fixstring') action!: string;
    // eslint-disable-next-line
    // @ts-ignore
    @attr('object', {snakifyForApi: true}) params!: LogParamModel;

    @belongsTo('node', { inverse: null})
    node!: AsyncBelongsTo<NodeModel> & NodeModel;

    @belongsTo('node', { inverse: null })
    originalNode!: AsyncBelongsTo<NodeModel> & NodeModel;

    @belongsTo('user')
    user!: AsyncBelongsTo<UserModel> & UserModel;

    @belongsTo('node', { inverse: null })
    linkedNode!: AsyncBelongsTo<NodeModel> & NodeModel;

    @belongsTo('node', { inverse: null })
    templateNode!: AsyncBelongsTo<NodeModel> & NodeModel;

    @belongsTo('registration', { inverse: null })
    linkedRegistration!: AsyncBelongsTo<RegistrationModel> & RegistrationModel;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        log: LogModel;
    } // eslint-disable-line semi
}
