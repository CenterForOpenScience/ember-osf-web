import Component from '@glimmer/component';
import LogModel from 'ember-osf-web/models/log';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';
import { tracked } from '@glimmer/tracking';
import { taskFor } from 'ember-concurrency-ts';
import { task } from 'ember-concurrency';
import { waitFor } from '@ember/test-waiters';


interface ActivityLogDisplayArgs {
    log: LogModel;
}

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
    hasLinkedNode = false;
    hasNode = false;

    constructor(owner: unknown, args: ActivityLogDisplayArgs) {
        super(owner, args);
        this.log = args.log;
        taskFor(this.loadLog).perform();
    }

    private buildAHrefElement(url: string, value: string): string {
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

    private buildParam(log: LogModel): ParamModel {
        /*
        if ( this.hasLinkedNode) {
            console.log(2, this.log.linkedNode);
        }
        if ( this.hasNode) {
            console.log(3, this.log.node);
        }
        console.log(4, this.log.user);
        // console.log(this.log?.linkedNode?.get('title'));
        // console.log(this.log?.linkedNode?.get('links'));
        */
        return {
            anonymousLink: log.params.anonymousLink ? 'an anonymous' : 'a',
            fullName: this.log.user?.get('fullName'),
            guid: log.params.guid,
            license: log.params.license,
            node: log.params.paramsNode.title,
            path: log.params.path,
            pathType: log.params.pathType,
            tag: log.params.tag,
            pointer: 'pointer',
            pointerCategory: 'hello', // this.getPointerCategory(this.log),
        };
    }

    @task
    @waitFor
    private async loadLog(): Promise<void> {
        // console.log('loadLog', this.log);
        await this.log;
        // console.log('loadLog - 2', this.log);
        await this.log.user;
        /*
        console.log('loadLog - 3', this.log?.user);
        console.log('loadLog - 41', this.log?.linkedNode);

        if (this.log?.linkedNode ) {
            await this.log.linkedNode;
            console.log('loadLog - 4', this.log?.linkedNode);
        }
        if (this.log?.node)  {
            await this.log.node;
            console.log('loadLog - 5', this.log?.node);
        }
            */
        //  console.log(3);
        try {
        // console.log(31);
            if (this.log?.linkedNode ) {
            // console.log(32);
                await this.log.linkedNode;
                // console.log(33);
                this.hasLinkedNode = true;
                // console.log('loadLog - 4', this.log?.linkedNode);
            }
        } catch (_) {
            this.hasLinkedNode = false;
        // console.log(35, _);
        }
        // console.log(36);
        try {
        // console.log(50);
            if (this.log?.node)  {
                // console.log(51);
                await this.log.node;
                // console.log(52);
                this.hasNode = true;
                // console.log(53, this.log?.node);
            }
        } catch (_) {
            this.hasNode = false;
            // console.log(55, _);
        }
        // console.log(56, this.hasLinkedNode, this.hasNode);
        this.isLoading = false;
    }

    /**
     * Get the activity
     */
    get activity(): string {
        // console.log('activity', this.log);

        // this.loadLog();

        const logParams = this.buildParam(this.log);

        return this.intl.t(`activity-log.activities.${this.log?.action}`, {
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
            htmlSafe: true,

        }) as string;
    }

    /**
     * getPointer
     *
     * @description The pointer can exist on a linkedNode or registrationNode
     *
     * @param log The log model
     *
     * @returns the category if it exists
     */
    /*
    private getPointerCategory(log: LogModel): string {
        /*
        if (log?.linkedNode) {
            return log.linkedNode?.get('category');
        } else if (log?.linkedRegistration) {
            return log.linkedRegistration?.get('category');
        } else {
            return '';
        }
            * /
            return '';
    }
    */

    /**
     * getPointerCategory
     *
     * @description The pointer category can exist on a linkedNode or registrationNode
     * @param log The log model
     *
     * @returns the category if it exists
     * /
    private getPointer(log: LogModel): string {
        /*
        if (log?.linkedNode) {
            return log.linkedNode?.get('category');
        } else if (log?.linkedRegistration) {
            return log.linkedRegistration?.get('category');
        } else {
            return '';
        }
            * /
            return '';
    }
            */
}
