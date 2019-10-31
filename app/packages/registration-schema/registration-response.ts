/* eslint-disable camelcase */
export interface FileReference {
    file_id: string;
    file_name: string;
    file_urls: {
        html: string,
        download: string,
    };
    file_hashes: {
        sha256: string,
    };
}
/* eslint-enable camelcase */

export type ResponseValue = string | string[] | FileReference[] | null;

export type RegistrationResponse = Record<string, ResponseValue>;
