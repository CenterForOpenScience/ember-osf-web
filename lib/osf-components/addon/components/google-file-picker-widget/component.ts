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
    GOOGLE_FILE_PICKER_SCOPES,
    GOOGLE_FILE_PICKER_CLIENT_ID,
    GOOGLE_FILE_PICKER_API_KEY,
    GOOGLE_FILE_PICKER_APP_ID,
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
    gapi?: any;
    google?: any;
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
    @tracked visible = false;
    pickerInited = false;
    gisInited = false;
    selectFolder: any = undefined;
    tokenClient: any = undefined;
    accessToken!: string;
    scopes = GOOGLE_FILE_PICKER_SCOPES;
    clientId = GOOGLE_FILE_PICKER_CLIENT_ID;
    apiKey = GOOGLE_FILE_PICKER_API_KEY;
    appId = GOOGLE_FILE_PICKER_APP_ID;
    mimeTypes = '';
    parentId = '';
    isMultipleSelect: boolean;
    title!: string;

    /**
     * Constructor
     *
     * @description
     * Initializes the GoogleFilePickerWidget component and exposes its key methods to the global `window` object
     * for integration with external JavaScript (e.g., Google Picker API).
     *
     * - Sets `window.GoogleFilePickerWidget` to the current component instance (`this`),
     *   allowing external scripts to call methods like `filePickerCallback()`.
     * - Captures the closure action `selectFolder` from `this.args` and assigns it directly to `window.selectFolder`,
     *   preserving the correct closure reference even outside of Ember's internal context.
     *
     * @param owner - The owner/context passed by Ember at component instantiation.
     * @param args - The arguments passed to the component, including closure actions like `selectFolder`.
     */
    constructor(owner: unknown, args: Args) {
        super(owner, args);

        window.GoogleFilePickerWidget = this;
        // window.selectFolder = this.args.selectFolder;
        // window.SCOPES = GOOGLE_FILE_PICKER_SCOPES;
        // window.CLIENT_ID = GOOGLE_FILE_PICKER_CLIENT_ID;
        // window.API_KEY= GOOGLE_FILE_PICKER_API_KEY;
        // window.APP_ID= GOOGLE_FILE_PICKER_APP_ID;
        // window.MIME_TYPES = this.args.isFolderPicker ? 'application/vnd.google-apps.folder' : '';
        // window.PARENT_ID = this.args.isFolderPicker ? '': this.args.rootFolderId;
        // window.IS_MULTIPLE_SELECT = !this.args.isFolderPicker;
        /*
        window.TITLE = this.args.isFolderPicker ?
            this.intl.t('addons.configure.google-file-picker.root-folder-title') :
            this.intl.t('addons.configure.google-file-picker.file-folder-title');
        */
        this.selectFolder = this.args.selectFolder;
        this.mimeTypes = this.args.isFolderPicker ? 'application/vnd.google-apps.folder' : '';
        this.parentId = this.args.isFolderPicker ? '': this.args.rootFolderId;
        this.title = this.args.isFolderPicker ?
            this.intl.t('addons.configure.google-file-picker.root-folder-title') :
            this.intl.t('addons.configure.google-file-picker.file-folder-title');
        this.isMultipleSelect = !this.args.isFolderPicker;
        // window.isFolderPicker = this.args.isFolderPicker;
        this.isFolderPicker = this.args.isFolderPicker;
        // window.tokenClient = undefined;
        // window.pickerInited = false;
        // window.gisInited = false;


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
            this.accessToken = token.oauthToken;
        }
    }

    /**
     * filePickerCallback
     *
     * @description
     * Action triggered when a file is selected via an external picker.
     * Logs the file data and notifies the parent system by calling `selectFolder`.
     *
     * @param file - The file object selected (format determined by external API)
     */
    @action
    filePickerCallback(file: any) {
        if (this.selectFolder !== undefined) {
            this.folderName = file.name;
            this.selectFolder({
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
        if (this.handleAuthClick) {
            this.handleAuthClick();
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
        delete this.tokenClient;
        this.pickerInited = false;
        this.gisInited = false;
    }


    /**
    * Callback after api.js is loaded.
    */
    gapiLoaded() {
        window.gapi.load('client:picker', this.initializePicker.bind(this));
    }

    /**
    * Callback after the API client is loaded. Loads the
    * discovery doc to initialize the API.
    */
    async initializePicker() {
        await window.gapi.client.load('https://www.googleapis.com/discovery/v1/apis/drive/v3/rest');
        this.pickerInited = true;
        this.maybeEnableButtons();
    }

    /**
    * Callback after Google Identity Services are loaded.
    */
    gisLoaded() {
        if (!this.tokenClient) {
            this.tokenClient = window.google?.accounts?.oauth2.initTokenClient({
                client_id: this.clientId,
                scope: this.scopes,
                callback: '', // defined later
            });
        }
        this.gisInited = true;
        this.maybeEnableButtons();
    }

    /**
    * Enables user interaction after all libraries are loaded.
    */
    maybeEnableButtons() {
        if (this.pickerInited && this.gisInited && this.isFolderPicker) {
            this.visible = true;
        }
    }

    /**
    *  Sign in the user upon button click.
    */
    @action
    handleAuthClick() {
        this.tokenClient.callback = async (response: any) => {
            if (response.error !== undefined) {
                throw (response);
            }
            await this.createPicker();
        };

        if (this.accessToken === null) {
            // Prompt the user to select a Google Account and ask for consent to share their data
            // when establishing a new session.
            this.tokenClient?.requestAccessToken({prompt: 'consent'});
        } else {
            // Skip display of account chooser and consent dialog for an existing session.
            this.tokenClient?.requestAccessToken({prompt: ''});
        }
    }

    /**
    *  Create and render a Picker object for searching images.
    */
    createPicker() {
        const googlePickerView = new window.google.picker.DocsView(window.google.picker.ViewId.DOCS);
        googlePickerView.setSelectFolderEnabled(true);
        googlePickerView.setMimeTypes(this.mimeTypes);
        googlePickerView.setIncludeFolders(true);
        googlePickerView.setParent(this.parentId);

        const picker = new window.google.picker.PickerBuilder()
            .enableFeature(this.isMultipleSelect ? window.google.picker.Feature.MULTISELECT_ENABLED : '')
            .setDeveloperKey(this.apiKey)
            .setAppId(this.appId)
            .addView(googlePickerView)
            .setTitle(this.title)
            .setOAuthToken(this.accessToken)
            .setCallback(this.pickerCallback.bind(this))
            .build();
        picker.setVisible(true);
    }

    /**
    * Displays the file details of the user's selection.
    * @param {object} data - Containers the user selection from the picker
    */
    async pickerCallback(data: any) {
        if (data.action === window.google.picker.Action.PICKED) {
            const document = data[window.google.picker.Response.DOCUMENTS][0];
            const fileId = document[window.google.picker.Document.ID];
            const res = await window.gapi.client.drive.files.get({
                fileId,
                fields: '*',
            });
            // Correctly call the Ember method
            this.filePickerCallback(res.result);
        }
    }
}


