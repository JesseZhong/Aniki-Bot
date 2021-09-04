export interface Metadata {
    'og:image': string,
    'og:title': string
}

export type FetchMetadataHandler = (
    meta_url: string,
    received: (metadata: Metadata) => void
) => void;