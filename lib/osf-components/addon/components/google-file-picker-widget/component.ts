import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import config from 'ember-osf-web/config/environment';
import { Item } from 'ember-osf-web/models/addon-operation-invocation';

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
    MIME_TYPES: string;
    PARENT_ID: string;
    TITLE: string;
    IS_MULTIPLE_SELECT: boolean;
    isFolderPicker: boolean;
  }
}

//
// 🚀 GoogleFilePickerWidget Component
//
// @description
// An Ember Glimmer component that exposes itself to the global `window`
// so that external JavaScript (like Google Picker API callbacks)
// can interact with it directly.
//
export default class GoogleFilePickerWidget extends Component<Args> {
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
        window.PARENT_ID = this.args.isFolderPicker ? '': '10hkGp1TUz2HFG9ioDUWe7k6Eqytj7kWS';
        window.TITLE = this.args.isFolderPicker ? 'Select a root folder': 'Select files to display';
        window.IS_MULTIPLE_SELECT = !this.args.isFolderPicker;
        window.isFolderPicker = this.args.isFolderPicker;

        this.folderName = this.args.selectedFolderName;
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
}

