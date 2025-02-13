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

/**
 * The Param Model
 */
interface ParamModel {
    guid: string;
    fullName: string;
    license: string;
    node: string;
    path: string;
    pathType: string;
    pointer: string;
    pointerCategory: string;
    tag: string;
    anonymousLink: string;
}

export default class ActivityLogDisplayComponent extends Component<ActivityLogDisplayArgs> {
    @service intl!: Intl;
    @tracked activityDisplay = '';
    @tracked isLoading = true;
    @tracked log!: LogModel;
    user!: UserModel;
    linkedNode!: NodeModel;
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
     * buildParam
     *
     * @description Abstracted method to build (assembly) all of the necessary translation variables
     *
     * @returns A Param model
     */
    private buildParam(): ParamModel {
        return {
            anonymousLink: this.log.params.anonymousLink ? 'an anonymous' : 'a',
            fullName:  this.buildFullNameUrl(),
            guid: this.log.params.guid,
            license: this.log.params.license,
            node: this.log.params.paramsNode.title,
            path: this.log.params.path,
            pathType: this.log.params.pathType,
            tag: this.log.params.tag,
            pointer: this.getPointer(),
            pointerCategory: this.getPointerCategory(),
        };
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
    private async loadModels(): Promise<void> {
        this.user = await this.log.user;
        this.linkedNode = await this.log.linkedNode;
        this.linkedRegistration = await this.log.linkedRegistration;
        this.node = await this.log.node;
        this.isLoading = false;
    }

    /**
     * activity
     *
     * @description The html to display for the log
     *
     * @returns A formatted translated string for display
     */
    get activity(): string {
        const logParams = this.buildParam();

        const translation = this.intl.t(`activity-log.activities.${this.log?.action}`, {
            anonymous_link: logParams.anonymousLink,
            guid: logParams.guid,
            license: logParams.license,
            node: logParams.node,
            path: logParams.path,
            path_type: logParams.pathType,
            pointer: logParams.pointer,
            pointer_category: logParams.pointerCategory,
            tag: logParams.tag,
            user: logParams.fullName,
            /*
            addon: null,
            comment_location: null,
            contributors: null,
            destination: null,
            forked_from: null,
            group: null,
            identifiers: null,
            institution: null,
            kind: null,
            new_identifier: null,
            obsolete_identifier: null,
            old_page: null,
            page: null,
            preprint: null,
            preprint_provider: null,
            source: null,
            template: null,
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
     * buildFullNameUrl
     *
     * @description Abstracted method to build the full name ahref
     *
     * @returns a formatted string
     */
    private buildFullNameUrl(): string {
        if (this.user) {
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
            return this.linkedNode?.category;
        } else if (this.linkedRegistration) {
            return this.linkedRegistration?.category;
        } else {
            return '';
        }
    }

    /**
     * getPointer
     *
     * @description The pointer can exist on a linkedNode or registrationNode
     *
     * @returns the href if it exists
     */
    private getPointer(): string {
        if (this.linkedNode) {
            return this.buildAHrefElement(this.linkedNode?.links?.html?.toString(), this.linkedNode?.title);
        } else if (this.linkedRegistration) {
            return this.buildAHrefElement(this.linkedRegistration?.links?.html?.toString(),
                this.linkedRegistration?.title);
        } else {
            return '';
        }
    }
}
