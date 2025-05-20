import Store from '@ember-data/store';
import { action } from '@ember/object';
import { waitFor } from '@ember/test-waiters';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import config from 'ember-osf-web/config/environment';
import { Item } from 'ember-osf-web/models/addon-operation-invocation';
import StorageManager from 'osf-components/components/storage-provider-manager/storage-manager/component';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';

const {
    googleFilePickerScopes,
    googleFilePickerClientId,
    googleFilePickerApiKey,
    googleFilePickerAppId,
} = config.OSF.googleFilePicker;

//
// 📚 Interface for Expected Arguments
//
interface Args {
  /**
   * selectFolder
   *
   * @description
   * A callback function passed into the component
   * that accepts a partial Item object and handles it (e.g., selects a file).
   */
  selectFolder?: (a: Partial<Item>) => void;
  onRegisterChild?: (a: GoogleFilePickerWidget) => void;
  selectedFolderName?: string;
  isFolderPicker: boolean;
  rootFolderId: string;
  manager: StorageManager;
  accountId: string;
}

//
// 📚 Extend Global Window Type
//
// Declares that `window` can optionally have a GoogleFilePickerWidget instance.
// This allows safe typing when accessing it elsewhere.
//
declare global {
  interface Window {
    GoogleFilePickerWidget?: GoogleFilePickerWidget;
    selectFolder?: (a: Partial<Item>)=> void;
    handleAuthClick?: ()=> void;
    SCOPES: string;
    CLIENT_ID: string;
    API_KEY: string;
    APP_ID: number;
    accessToken: string;
    MIME_TYPES: string;
    PARENT_ID: string;
    TITLE: string;
    IS_MULTIPLE_SELECT: boolean;
    isFolderPicker: boolean;
    tokenClient: any;
    pickerInited: boolean;
    gisInited: boolean;
  }
}

//
// GoogleFilePickerWidget Component
//
// @description
// An Ember Glimmer component that exposes itself to the global `window`
// so that external JavaScript (like Google Picker API callbacks)
// can interact with it directly.
//
export default class GoogleFilePickerWidget extends Component<Args> {
    @service intl!: Intl;
    @service store!: Store;
    @tracked folderName!: string | undefined;
    @tracked isFolderPicker = false;
    @tracked openGoogleFilePicker = false;
    /**
     * Constructor
     *
     * @description
     * Initializes the GoogleFilePickerWidget component and exposes its key methods to the global `window` object
     * for integration with external JavaScript (e.g., Google Picker API).
     *
     * - Sets `window.GoogleFilePickerWidget` to the current component instance (`this`),
     *   allowing external scripts to call methods like `filePickerCallback()`.
     * - Captures the closure action `selectItem` from `this.args` and assigns it directly to `window.selectItem`,
     *   preserving the correct closure reference even outside of Ember's internal context.
     *
     * @param owner - The owner/context passed by Ember at component instantiation.
     * @param args - The arguments passed to the component, including closure actions like `selectItem`.
     */
    constructor(owner: unknown, args: Args) {
        super(owner, args);
        window.GoogleFilePickerWidget = this;
        window.selectFolder = this.args.selectFolder;
        window.SCOPES = googleFilePickerScopes;
        window.CLIENT_ID = googleFilePickerClientId;
        window.API_KEY= googleFilePickerApiKey;
        window.APP_ID= googleFilePickerAppId;
        window.MIME_TYPES = this.args.isFolderPicker ? 'application/vnd.google-apps.folder' : '';
        window.PARENT_ID = this.args.isFolderPicker ? '': this.args.rootFolderId;
        window.TITLE = this.args.isFolderPicker ?
            this.intl.t('addons.configure.google-file-picker.root-folder-title') :
            this.intl.t('addons.configure.google-file-picker.file-folder-title');
        window.IS_MULTIPLE_SELECT = !this.args.isFolderPicker;
        window.isFolderPicker = this.args.isFolderPicker;
        this.isFolderPicker = this.args.isFolderPicker;
        window.tokenClient = undefined;
        window.pickerInited = false;
        window.gisInited = false;

        this.folderName = this.args.selectedFolderName;

        taskFor(this.loadOauthToken).perform();
    }

    @task
    @waitFor
    private async loadOauthToken(): Promise<void>{
        if (this.args.accountId) {
            const authorizedStorageAccount = await this.store.
                findRecord('authorized-storage-account', this.args.accountId);
            authorizedStorageAccount.serializeOauthToken = true;
            const token = await authorizedStorageAccount.save();
            window.accessToken = token.oauthToken;
        }
    }

    /**
     * filePickerCallback
     *
     * @description
     * Action triggered when a file is selected via an external picker.
     * Logs the file data and notifies the parent system by calling `selectItem`.
     *
     * @param file - The file object selected (format determined by external API)
     */
    @action
    filePickerCallback(file: any) {
        if (window?.selectFolder !== undefined) {
            this.folderName = file.name;
            window?.selectFolder({
                itemName: file.name,
                itemId: file.id,
            });
        } else {
            this.args.manager.reload();
        }
    }

    @action
    openPicker() {
        // Logic for opening Google File Picker here
        if (window.handleAuthClick) {
            window.handleAuthClick();
        }
    }

    @action
    registerComponent() {
        if (this.args.onRegisterChild) {
            this.args.onRegisterChild(this); // Pass the child's instance to the parent
        }
    }

    willDestroy() {
        super.willDestroy();
        delete window.tokenClient;
        window.pickerInited = false;
        window.gisInited = false;
    }
}


