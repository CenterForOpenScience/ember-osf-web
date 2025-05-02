import Service, { inject as service } from '@ember/service';
import HeadTagsService from 'ember-cli-meta-tags/services/head-tags';
import config from 'ember-osf-web/config/environment';
import Intl from 'ember-intl/services/intl';
import pathJoin from 'ember-osf-web/utils/path-join';
import toArray from 'ember-osf-web/utils/to-array';

interface MetaTagAuthor {
    givenName: string;
    familyName: string;
}

type Content = string | number | null | undefined | MetaTagAuthor;

type DataContent = Content | Content[];

export interface MetaTagsData {
    title?: DataContent;
    type?: DataContent;
    description?: DataContent;
    url?: DataContent;
    doi?: DataContent;
    identifier?: DataContent;
    publishedDate?: DataContent;
    modifiedDate?: DataContent;
    license?: DataContent;
    language?: DataContent;
    image?: DataContent;
    imageType?: DataContent;
    imageWidth?: DataContent;
    imageHeight?: DataContent;
    imageAlt?: DataContent;
    siteName?: DataContent;
    institution?: DataContent;
    fbAppId?: DataContent;
    twitterSite?: DataContent;
    twitterCreator?: DataContent;
    contributors?: DataContent;
    keywords?: DataContent;
}

interface MetaTagsDefs {
    [s: string]: DataContent;
}

export interface NameMetaTagAttrs {
    name: string;
    content: DataContent;
}

export interface PropMetaTagAttrs {
    property: string;
    content: DataContent;
}

export interface LinkMetaTagAttrs {
    rel: string;
    href: string;
}

export interface ScriptTagAttrs {
    type: string;
}

type MetaTagAttrs = NameMetaTagAttrs | PropMetaTagAttrs | LinkMetaTagAttrs | ScriptTagAttrs;

export interface HeadTagDef {
    type: string;
    content?: string;
    attrs: MetaTagAttrs;
}

export default class MetaTags extends Service {
    @service intl!: Intl;
    @service router!: any;
    @service headTags!: HeadTagsService;

    /**
     * buildPersonScriptTag
     * ENG-6331 requested more granularity for authors
     * This abstracted method get the granulatority required
     *
     * @param contributors The list of contributors
     *
     * @returns {HeadTagDef}
     */
    private buildPersonScriptTag(contributors: DataContent): HeadTagDef {
        const contributor = [];
        if(Array.isArray(contributors)) {
            contributors.forEach((person: MetaTagAuthor) => {
                contributor.push(Object({
                    '@type': 'schema:Person',
                    givenName: person.givenName,
                    familyName: person.familyName,
                }));
            });
        } else {
            contributor.push(Object({
                '@type': 'schema:Person',
                givenName: (contributors as MetaTagAuthor).givenName,
                familyName: (contributors as MetaTagAuthor).familyName,
            }));
        }

        return {
            type: 'script',
            content: JSON.stringify({
                '@context': {
                    dc: 'http://purl.org/dc/elements/1.1/',
                    schema: 'http://schema.org',
                },
                '@type': 'schema:CreativeWork',
                contributor,
            }),
            attrs: {
                type: 'application/ld+json',
            },
        };
    }

    /**
     * Get head tag definitions suitable for the head-tags service.
     *
     * @method getHeadTags
     * @param {MetaTagsData} metaTagsData Data values to use for meta tags.
     * @return {MetaTagAttrs[]} Returns head tag defintions.
     */
    public getHeadTags(metaTagsData: MetaTagsData): HeadTagDef[] {
        const metaTagsDefs = this.getMetaTags(metaTagsData);
        // Morph MetaTagsDefs into an array of MetaTagAttrs.
        const headTagsAttrs: MetaTagAttrs[] = Object.entries(metaTagsDefs)
            .reduce(
                (acc: MetaTagAttrs[], [name, content]) => acc.concat(
                    toArray(content).map(contentMember => this.makeMetaTagAttrs(name, contentMember)),
                ), [],
            );


        const headTags = headTagsAttrs
            .filterBy('content') // Remove tags with no content.
            .map(attrs => ({ type: 'meta', attrs }));

        if (metaTagsData?.contributors) {
            headTags.push(this.buildPersonScriptTag(metaTagsData.contributors));
        }

        return headTags;
    }

    public updateHeadTags() {
        this.headTags.collectHeadTags();

        // https://www.zotero.org/support/dev/exposing_metadata#force_zotero_to_refresh_metadata
        const ev = new Event('ZoteroItemUpdated', {
            bubbles: true,
            cancelable: true,
        });
        document.dispatchEvent(ev);
    }


    /**
     * Get meta tag definitions.
     *
     * @method getMetaTags
     * @param {MetaTagsData} metaTagsOverrides Data values to override defaults.
     * @return {MetaTagsDefs} Returns meta tag definitions.
     */
    private getMetaTags(metaTagsOverrides: MetaTagsData): MetaTagsDefs {
        // Default values.
        const currentUrl = window.location.href;
        const metaTagsData: MetaTagsData = {
            type: 'article',
            description: this.intl.t('general.hosted_on_the_osf'),
            url: pathJoin(config.OSF.url, currentUrl),
            language: this.intl.get('locale'),
            image: pathJoin(config.OSF.url, 'static/img/preprints_assets/osf/sharing.png'),
            imageType: 'image/png',
            imageWidth: 1200,
            imageHeight: 630,
            imageAlt: this.intl.t('home.brand'),
            siteName: this.intl.t('home.brand'),
            institution: this.intl.t('general.cos'),
            fbAppId: config.FB_APP_ID,
            twitterSite: config.social.twitter.viaHandle,
            twitterCreator: config.social.twitter.viaHandle,
            ...metaTagsOverrides,
        };

        // Include URL, DOI, and any additional identifiers.
        const identifiers = toArray(metaTagsData.url)
            .concat(toArray(metaTagsData.doi))
            .concat(toArray(metaTagsData.identifier));

        return {
            // Citation
            citation_title: metaTagsData.title,
            citation_doi: metaTagsData.doi,
            citation_publisher: metaTagsData.siteName,
            citation_author_institution: metaTagsData.institution,
            citation_author: metaTagsData.contributors,
            citation_description: metaTagsData.description,
            citation_public_url: metaTagsData.url,
            citation_publication_date: metaTagsData.publishedDate,
            // Dublin Core
            'dct.title': metaTagsData.title,
            'dct.type': metaTagsData.type,
            'dct.identifier': identifiers,
            'dct.abstract': metaTagsData.description,
            'dct.license': metaTagsData.license,
            'dct.modified': metaTagsData.modifiedDate,
            'dct.created': metaTagsData.publishedDate,
            'dc.publisher': metaTagsData.siteName,
            'dc.language': metaTagsData.language,
            'dc.contributor': metaTagsData.contributors,
            'dc.subject': metaTagsData.keywords,
            // Open Graph/Facebook
            'fb:app_id': metaTagsData.fbAppId,
            'og:ttl': 345600, // 4 days = min value.
            'og:title': metaTagsData.title,
            'og:type': metaTagsData.type,
            'og:site_name': metaTagsData.siteName,
            'og:url': metaTagsData.url,
            'og:secure_url': metaTagsData.url,
            'og:description': metaTagsData.description,
            'og:image': metaTagsData.image,
            'og:image:type': metaTagsData.imageType,
            'og:image:width': metaTagsData.imageWidth,
            'og:image:height': metaTagsData.imageHeight,
            'og:image:alt': metaTagsData.imageAlt,
            // Twitter
            'twitter:card': 'summary',
            'twitter:site': metaTagsData.twitterSite,
            'twitter:creator': metaTagsData.twitterCreator,
            'twitter:title': metaTagsData.title,
            'twitter:description': metaTagsData.description,
            'twitter:image': metaTagsData.image,
            'twitter:image:alt': metaTagsData.imageAlt,
        };
    }

    /**
     * buildMetaTagContent
     * ENG-6331 requested more granularity for authors
     * This abstracted method get the granulatority required
     *
     * @param name The name of the attribute
     * @param content The content
     * @returns {Content}
     */
    private buildMetaTagContent(name: string, content: Content): Content{
        if (['citation_author', 'dc.contributor'].includes(name) && typeof content === 'object') {
            return `${content?.familyName}, ${content?.givenName}`;
        }

        return content;
    }

    private makeMetaTagAttrs(name: string, content: Content): MetaTagAttrs {
        // Open Graph/Facebook tags use 'property' instead of 'name'.
        content = this.buildMetaTagContent(name, content);
        if (['fb:', 'og:'].includes(name.substring(0, 3))) {
            return { property: name, content};
        }
        return { name, content};
    }

}

declare module '@ember/service' {
    interface Registry {
        'meta-tags': MetaTags;
    }
}
