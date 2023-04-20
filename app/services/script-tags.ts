/* eslint-disable no-mixed-spaces-and-tabs*/
import Service, { inject as service } from '@ember/service';
import config from 'ember-get-config';
import Intl from 'ember-intl/services/intl';
import CurrentUserService from 'ember-osf-web/services/current-user';
import { MetaTagAttrs } from 'ember-osf-web/services/meta-tags';
import getHref from 'ember-osf-web/utils/get-href';

export type Content = object | string | String | number | null | undefined;

export type DataContent = Content | Content[];

export interface ScriptTagsData {
    type?: DataContent;
    content?: DataContent;
}

export interface ScriptTagDef {
    [s: string]: DataContent;
}

export interface JSONLDScriptTagAttrs {
    type: Content;
}

export type ScriptTagAttrs = JSONLDScriptTagAttrs;

// ember-cli-meta-tags element types
export enum TagType {
    BASE = 'base',
    LINK = 'link',
    META = 'meta',
    SCRIPT = 'script',
    NOSCRIPT = 'noscript',
    TITLE = 'title',
}

export interface HeadTagDef {
    type: string;
    content: DataContent;
    attrs: MetaTagAttrs | ScriptTagAttrs;
}

/**
 *
 * Creates one script tag with model-specific overrides or default attribute values.
 * Should additional script tags be needed, getHeadTags() should be called for each
 * script and added to the headTags array.
 *
 * @method getScriptTagAttributes
 * @method getHeadTags
 * @param {ScriptTagsData} scriptTagsOverrides Overrides defaults
 * @return {HeadTagsDefs} getHeadTags() returns HeadTagDefs for ScriptTagAttrs
 */
export default class ScriptTags extends Service {
    @service intl!: Intl;
    @service router!: any;
    @service currentUser!: CurrentUserService;

    async returnStructuredData(guid: string): Promise<any> {
        const url = `${config.OSF.url}/${guid}/metadata/?format=google-dataset-json-ld`;
        let jsonLD: object = {}; // TODO add default FE structure here
        let jsonFetch : object | void;
        try {
            jsonFetch = await this.returnJSON(url);
            if (jsonFetch && (typeof(jsonFetch) === 'object')) {
                jsonLD = jsonFetch;
            }
        } catch (e) {
            throw new Error(this.intl.t('general.structured_data.json_ld_retrieval_error'));
        }
        return jsonLD;
    }

    async returnJSON(url: string) {
        const ajax = await this.currentUser.authenticatedAJAX({
            method: 'GET',
            url: getHref(url),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return ajax;
    }

    getScriptTagAttributes(scriptTagsOverrides: ScriptTagsData): ScriptTagDef {
        // Default values
        const scriptTagsData: ScriptTagsData = {
            type: scriptTagsOverrides.type ?
                scriptTagsOverrides.type : 'application/ld+json',
            content: scriptTagsOverrides.content ?
                scriptTagsOverrides.content : { isAccessibleForFree: true },
            ...scriptTagsOverrides,
        };
        return {
            type: scriptTagsData.type,
            dataContent: scriptTagsData.content,
        };
    }

    /**
     * Processes values from getScriptTagAttributes() to create HTML head element
     * script tags with content and data MIME type attributes.
     *
     * @method getHeadTags
     * @param {ScriptTagsData} scriptTagsData Default values for script tags
     * @return {HeadTagDef[]}
     */
    getHeadTags(scriptTagsData: ScriptTagsData): HeadTagDef[] {
        const scriptTagDefs: ScriptTagDef | ScriptTagDef[] = this.getScriptTagAttributes(scriptTagsData);
        const { type, dataContent } = scriptTagDefs;
        const attrs: ScriptTagAttrs = this.makeScriptTagAttrs(type);
        const array: HeadTagDef[] = [];
        const tagType: string = TagType.SCRIPT as string;
	    array.push({type: tagType, content: dataContent, attrs});
        return array;
    }

    makeScriptTagAttrs(type: Content) {
        return { type };
    }
}

declare module '@ember/service' {
    interface Registry {
        'script-tags': ScriptTags;
    }
}
