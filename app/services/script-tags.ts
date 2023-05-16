/* eslint-disable no-mixed-spaces-and-tabs*/
/* eslint-disable object-shorthand*/
/* eslint-disable no-undef-init*/
import Service, { inject as service } from '@ember/service';
import config from 'ember-get-config';
import Intl from 'ember-intl/services/intl';
import CurrentUserService from 'ember-osf-web/services/current-user';
import { MetaTagAttrs } from 'ember-osf-web/services/meta-tags';
import captureException from 'ember-osf-web/utils/capture-exception';

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
    @service currentUser!: CurrentUserService;

    async returnStructuredData(guid: string): Promise<any> {
        const url = `${config.OSF.url}/${guid}/metadata/?format=google-dataset-json-ld`;
        let jsonLD = undefined;
        let jsonFetch: object | undefined;
        try {
            jsonFetch = await this.currentUser.authenticatedAJAX({
                method: 'GET',
                url: url,
            });
            if (jsonFetch && (typeof(jsonFetch) === 'object')) {
                jsonLD = jsonFetch;
            }
        } catch (e) {
            const errorMessage = this.intl.t('general.structured_data.json_ld_retrieval_error');
            captureException(e, { errorMessage });
        }
        return jsonLD;
    }

    /**
     * Creates one HTML head element script tag with content and a data MIME type
     *
     * @method getHeadTags
     * @param {ScriptTagsData} scriptTagsData Override values from node
     * @return {HeadTagDef[]}
     */
    getHeadTags(scriptTagsOverrides: ScriptTagsData): HeadTagDef[] {
        return [{ type: 'script', content: scriptTagsOverrides.content, attrs: { type: scriptTagsOverrides.type } }];
    }
}

declare module '@ember/service' {
    interface Registry {
        'script-tags': ScriptTags;
    }
}
