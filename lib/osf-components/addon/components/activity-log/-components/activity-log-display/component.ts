import Component from '@glimmer/component';
import LogModel from 'ember-osf-web/models/log';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';
import { tracked } from '@glimmer/tracking';
import { taskFor } from 'ember-concurrency-ts';
import { task } from 'ember-concurrency';
import { waitFor } from '@ember/test-waiters';
import UserModel from 'ember-osf-web/models/user';
import NodeModel from 'ember-osf-web/models/node';
import RegistrationModel from 'ember-osf-web/models/registration';


/**
 * The Activity Log Display Args
 */
interface ActivityLogDisplayArgs {
    log: LogModel;
}

export default class ActivityLogDisplayComponent extends Component<ActivityLogDisplayArgs> {
    @service intl!: Intl;
    @tracked activityDisplay = '';
    @tracked log!: LogModel;
    user!: UserModel;
    linkedNode!: NodeModel;
    templateNode!: NodeModel;
    linkedRegistration!: RegistrationModel;
    node!: NodeModel;

    /**
     * constructor
     *
     * @param owner The owner
     * @param args The injected args
     */
    constructor(owner: unknown, args: ActivityLogDisplayArgs) {
        super(owner, args);
        this.log = args.log;
        taskFor(this.loadModels).perform();
    }

    /**
     * buildAHrefElement
     *
     * @description Abstracted method to build an "a" element
     *
     * @param url The url for the href
     * @param value The text to appear as clickable
     * @returns An ahref formatted string
     */
    private buildAHrefElement(url: string | undefined, value: string): string {
        url = url || '';
        return `<a href="${this.toRelativeUrl(url)}">${value}</a>`;
    }

    /**
     * Utility function to convert absolute URLs to relative urls
     * See:
     *      http://stackoverflow.com/questions/736513/how-do-i-parse-a-url-into-hostname-and-path-in-javascript
     * This method have no effect on external urls.
     * @param url {string} url to be converted
     * @returns {string} converted relative url
     */
    private toRelativeUrl(url: string): string {
        const parser = document.createElement('a');
        parser.href = url;
        let relative_url = url;
        if (window.location.hostname === parser.hostname){
            relative_url = parser.pathname + parser.search + parser.hash;
        }
        return relative_url;
    }

    /**
     * loadModels
     *
     * @description Hydrates all the models before displaying the component
     *
     * @returns a void promise
     */
    @task
    @waitFor
    public async loadModels(): Promise<void> {
        this.linkedNode = await this.log.linkedNode;
        this.linkedRegistration = await this.log.linkedRegistration;
        this.node = await this.log.node;
        this.templateNode = await this.log.templateNode;
        this.user = await this.log.user;
    }

    /**
     * activity
     *
     * @description The html to display for the log
     *
     * @returns A formatted translated string for display
     */
    get activity(): string {
        const translation = this.intl.t(`activity-log.activities.${this.log?.action}`, {
            anonymous_link: this.buildAnonymous(),
            forked_from: this.buildNodeUrl(),
            identifiers: this.buildIdentifiers(),
            institution: this.buildInstitutionUrl(),
            license: this.log?.params?.license,
            node: this.buildNodeUrl(),
            path: this.log?.params?.path,
            path_type: this.log?.params?.pathType,
            pointer: this.getEmbeddedUrl(),
            pointer_category: this.getPointerCategory(),
            preprint: this.buildPreprintUrl(),
            preprint_provider: this.buildPreprintProviderUrl(),
            preprint_word: this.intl.t('activity-log.defaults.preprint'),
            preprint_word_plural: this.intl.t('activity-log.defaults.preprint-plural'),
            tag: this.buildTagUrl(),
            template: this.getEmbeddedUrl(),
            user: this.buildFullNameUrl(),
            /*
            addon: null,
            comment_location: null,
            contributors: null,
            destination: null,
            group: null,
            kind: null,
            new_identifier: null,
            obsolete_identifier: null,
            old_page: null,
            page: null,
            source: null,
            title_new: null,
            title_original: null,
            updated_fields: null,
            value: null,
            version: null,
            */

        }) as string;

        return `<span>${translation}</span>`;

    }

    /**
     * buildAnonymous
     *
     * @description Abstracted method to build the anonymous string
     *
     * @returns a formatted string
     */
    private buildAnonymous(): string {
        return this.log?.params?.anonymousLink ?
            this.intl.t('activity-log.defaults.anonymous_an') :
            this.intl.t('activity-log.defaults.anonymous_a') ;
    }

    /**
     * buildInstitutionUrl
     *
     * @description Abstracted method to build the institution ahref
     *
     * @returns a formatted string
     */
    private buildInstitutionUrl(): string {
        if (this.log?.params?.institution) {
            return this.buildAHrefElement(
                `/institutions/${this.log.params.institution.id}`, this.log.params.institution.name,
            );
        }
        return '';
    }

    /**
     * buildNodeUrl
     *
     * @description Abstracted method to build the node ahref
     *
     * @returns a formatted string
     */
    private buildNodeUrl(): string {
        if (this.log?.params?.paramsNode) {
            return this.buildAHrefElement(`/${this.log.params.paramsNode.id}`, this.log.params.paramsNode.title);
        }
        return '';
    }

    /**
     * buildIdentifiersUrl
     *
     * @description Abstracted method to build the identifiers ahref
     *
     * @returns a formatted string
     */
    private buildIdentifiers(): string {
        if (this.log?.params?.identifiers) {
            const doi = this.log.params.identifiers.doi;
            const ark = this.log.params.identifiers.ark;
            if (doi && ark) {
                return `doi:${doi} and ark:${ark}`;
            } else if (doi) {
                return `doi:${doi}`;
            } else if (ark) {
                return `ark:${ark}`;
            }
        }
        return '';
    }

    /**
     * buildPreprintUrl
     *
     * @description Abstracted method to build the preprint ahref
     *
     * @returns a formatted string
     */
    private buildPreprintUrl(): string {
        if (this.log?.params?.preprint) {
            return this.buildAHrefElement(`/${this.log.params.preprint}`,
                this.intl.t('activity-log.defaults.preprint'));
        }
        return '';
    }

    /**
     * buildPreprintProviderUrl
     *
     * @description Abstracted method to build the preprint provider ahref
     *
     * @returns a formatted string
     */
    private buildPreprintProviderUrl(): string {
        if (this.log?.params?.preprintProvider) {
            return this.buildAHrefElement(`/${this.log.params.preprintProvider.url}`,
                this.log.params.preprintProvider.name);
        }
        return '';
    }


    /**
     * buildTagUrl
     *
     * @description Abstracted method to build the tag ahref
     *
     * @returns a formatted string
     */
    private buildTagUrl(): string {
        if(this.log?.params?.tag) {
            return this.buildAHrefElement(
                `/search?q=%22${this.log.params.tag}%22`, this.log.params.tag,
            );
        }
        return '';
    }

    /**
     * buildFullNameUrl
     *
     * @description Abstracted method to build the full name ahref
     *
     * @returns a formatted string
     */
    private buildFullNameUrl(): string {
        if (this.user?.links) {
            return this.buildAHrefElement(this.user.links.html?.toString(), this.user.fullName);
        }
        return '';
    }

    /**
     * getPointerCategory
     *
     * @description The pointer can exist on a linkedNode or registrationNode
     *
     * @returns the category if it exists
     */
    private getPointerCategory(): string {
        if (this.linkedNode) {
            return this.linkedNode.category;
        } else if (this.linkedRegistration) {
            return this.linkedRegistration.category;
        } else {
            return '';
        }
    }

    /**
     * getEmbeddedUrl
     *
     * @description The pointer can exist on a linkedNode or registrationNode
     *
     * @returns the href if it exists
     */
    private getEmbeddedUrl(): string {
        if (this.linkedNode?.links?.html) {
            return this.buildAHrefElement(this.linkedNode.links.html.toString(), this.linkedNode.title);
        } else if (this.linkedRegistration?.links?.html) {
            return this.buildAHrefElement(this.linkedRegistration.links.html.toString(),
                this.linkedRegistration.title);
        } else if (this.templateNode?.links?.html) {
            return this.buildAHrefElement(this.templateNode.links.html.toString(),
                this.templateNode.title);
        } else {
            return '';
        }
    }
}
