/* eslint-disable no-use-before-define,space-infix-ops */

import * as JSONAPI from 'jsonapi-typescript';

namespace OSFAPI {

    type Document<
        T extends Document.Data.Data = Document.Data.Data
        > = Document.Data<T> | Document.Error;

    namespace Document {

        interface DocBase {
            meta: {
                version: string;
            };
            links: JSONAPI.Links;
        }

        interface Data<T extends Data.Data = Data.Data> extends DocBase {
            data: T;
        }

        namespace Data {

            type Data<
                T extends string = string,
                A extends Attributes = Attributes
                > = Resource<T, A> | Array<Resource<T, A>>;

            type SingleResource<
                T extends string = string,
                A extends Attributes = Attributes
                > = Document.Data<Resource<T, A>>;

            type CollectionResource<
                T extends string = string,
                A extends Attributes = Attributes
                > = Document.Data<Array<Resource<T, A>>>;

            type Attributes = JSONAPI.AttributesObject;

            interface Resource<
                T extends string = string,
                A extends Attributes = Attributes
            > extends JSONAPI.ResourceObject<T, A> {
                id: string | number;
                relationships?: Relationships;
                embeds?: any;
            }

            interface Relationships {
                [k: string]: Relationship;
            }

            type Relationship = Relationship.WithData | Relationship.WithLinks;

            namespace Relationship {

                interface WithData {
                    data: JSONAPI.ResourceLinkage;
                }

                interface WithLinks {
                    links: RelatedLink;
                }

                interface RelatedLink {
                    related: {
                        href: string;
                        meta: RelationshipMeta;
                    };
                }

                interface RelationshipMeta {
                    count?: number;
                }

            }

        }

        interface Error extends DocBase {
            errors: JSONAPI.Errors;
        }

    }

}

export default OSFAPI;

/* eslint-enable no-use-before-define,space-infix-ops */
