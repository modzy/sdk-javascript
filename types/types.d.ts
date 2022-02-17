export declare type LoggingLevel = "off" | "on" | "verbose";
export declare type ClassInitiator = {
    url?: string;
    apiKey: string;
    logging?: LoggingLevel;
};
export declare type GetModelsParams = {
    modelId?: string;
    author?: string;
    createdByEmail?: string;
    name?: string;
    description?: string;
    isActive?: boolean;
    isExpired?: boolean;
    isFeatured?: boolean;
    lastActiveDateTime?: string | Date;
    expirationDateTime?: string | Date;
    page?: number;
    perPage?: number;
    direction?: "ASC" | "DESC";
    sortBy?: string;
};
export declare type GetModelDetailsParams = {
    modelId: string;
    version: string;
};
export interface GetJobHistoryParams {
    user?: string;
    accessKey?: string;
    startDate?: string;
    endDate?: string;
    model?: string;
    status?: string;
    page?: number;
    perPage?: number;
    direction?: "ASC" | "DESC";
    sortBy?: string;
}
export interface SubmitJobParams {
    model: {
        identifier: string;
        version: string;
    };
    explain?: boolean;
    input?: Record<string, any>;
}
export interface SubmitJobTextParams {
    modelId: string;
    version: string;
    sources: {
        [key: string]: Record<string, string>;
    };
    explain?: boolean;
}
export interface GetOutputContentsParams {
    jobId: string;
    inputKey: string;
    outputName: string;
    responseType?: "json" | "blob" | "arraybuffer";
}
export interface SubmitJobFileParams {
    modelId: string;
    version: string;
    sources: {
        [key: string]: Record<string, any>;
    };
    explain?: boolean;
}
export interface SubmitJobJDBCParams {
    modelId: string;
    version: string;
    url: string;
    username: string;
    password: string;
    driver: string;
    query: string;
    explain?: boolean;
}
export interface SubmitJobAwsS3Params {
    modelId: string;
    version: string;
    accessKeyID: string;
    secretAccessKey: string;
    region: string;
    sources: string;
    explain?: boolean;
}
export interface SubmitJobEmbeddedParams {
    modelId: string;
    version: string;
    mediaType: string;
    sources: {
        [key: string]: Record<string, any>;
    };
    explain?: boolean;
}
export interface Model {
    latestVersion: string;
    modelId: string;
    versions: string[];
}
declare type Image = {
    url: string;
    caption: string;
    relationType: string;
};
declare type Tag = {
    dataType: string;
    identifier: string;
    isCategorical: boolean;
    name: string;
};
declare type Feature = {
    description?: string;
    identifier: string;
    name: string;
};
export interface LatestModel {
    activeVersions: string[];
    author: string;
    creationDateTime: string;
    description: string;
    features: Feature[];
    identifier: string;
    images: Image[];
    isActive: boolean;
    isAvailable: boolean;
    isCommercial: boolean;
    isExperimental: boolean;
    isRecommended: boolean;
    latestVersion: string;
    longDescription: string;
    name: string;
    permalink: string;
    sourceType: string;
    tags: Tag[];
    updateDateTime: string;
}
declare type AccessKey = {
    prefix: string;
    isDefault: boolean;
};
export interface JobHistoryResponseItem {
    jobIdentifier: string;
    submittedBy: string;
    accountIdentifier: string;
    model: {
        identifier: string;
        version: string;
        name: string;
    };
    status: string;
    createdAt: string;
    updatedAt: string;
    submittedAt: string;
    total: number;
    pending: number;
    completed: number;
    failed: number;
    elapsedTime: number;
    queueTime: number;
    user: {
        identifier: string;
        externalIdentifier: string;
        firstName: string;
        lastName: string;
        email: string;
        accessKeys: AccessKey[];
        status: string;
        title: string;
    };
    jobInputs: any[];
    explain: boolean;
}
export interface GetModelByIdResponse {
    modelId: string;
    latestVersion: string;
    latestActiveVersion: string;
    versions: string[];
    author: string;
    name: string;
    description: string;
    permalink: string;
    features: Feature[];
    isActive: boolean;
    isRecommended: boolean;
    isCommercial: boolean;
    tags: Tag[];
    images: Image[];
    snapshotImages: any[];
    lastActiveDateTime: string;
    visibility: {
        scope: string;
    };
}
declare type Statistic = {
    label: string;
    category: string;
    type: string;
    description: string;
    highlight: boolean;
    order: number;
    value: number;
};
declare type Input = {
    name: string;
    acceptedMediaTypes: string;
    maximumSize: number;
    description: string;
};
declare type Output = {
    name: string;
    mediaType: string;
    maximumSize: number;
    description: string;
};
export interface GetModelDetailsResponse {
    version: string;
    createdAt: string;
    updatedAt: string;
    inputValidationSchema: string;
    createdBy: string;
    timeout: {
        status: number;
        run: number;
    };
    requirement: {
        gpuUnits: number;
        cpuAmount: string;
        memoryAmount: string;
    };
    containerImage: {
        uploadStatus: string;
        loadStatus: string;
        uploadPercentage: number;
        loadPercentage: number;
        containerImageSize: number;
        registryHost: string;
        repositoryNamespace: string;
        repositoryName: string;
    };
    inputs: Input[];
    outputs: Output[];
    statistics: Statistic[];
    isActive: boolean;
    longDescription: string;
    technicalDetails: string;
    isAvailable: boolean;
    sourceType: string;
    versionHistory: string;
    status: string;
    performanceSummary: string;
    model: GetModelByIdResponse;
    processing: {
        minimumParallelCapacity: number;
        maximumParallelCapacity: number;
    };
}
declare type Version = {
    version: string;
};
export declare type GetModelVersionsByIdResponse = Version[];
export interface SubmitJobResponse {
    model: {
        identifier: string;
        version: string;
        name: string;
    };
    status: string;
    totalInputs: number;
    jobIdentifier: string;
    accessKey: string;
    explain: boolean;
    jobType: string;
    accountIdentifier: string;
    team: {
        identifier: string;
    };
    user: {
        identifier: string;
        externalIdentifier: string;
        firstName: string;
        lastName: string;
        email: string;
        status: string;
    };
    jobInputs: {
        identifier: string[];
    };
    submittedAt: string;
    hoursDeleteInput: number;
    imageClassificationModel: boolean;
}
export interface Engine {
    identifier: string;
    version: string;
    failed: number;
    queued: number;
    spinningUp: number;
    spinningDown: number;
    running: number;
    ready: number;
}
export declare type EnginesResponse = Engine[];
declare type AccessKeys = {
    prefix: string;
    isDefault: boolean;
};
export declare type JobInput = {
    identifier: string;
};
export interface GetJobResponse {
    jobIdentifier: string;
    submittedBy: string;
    accountIdentifier: string;
    model: {
        identifier: string;
        version: string;
        name: string;
    };
    status: string;
    createdAt: string;
    updatedAt: string;
    submittedAt: string;
    total: number;
    pending: number;
    completed: number;
    failed: number;
    elapsedTime: number;
    queueTime: number;
    user: {
        identifier: string;
        externalIdentifier: string;
        firstName: string;
        lastName: string;
        email: string;
        accessKeys: AccessKeys[];
        status: string;
        title: string;
    };
    jobInputs: JobInput[];
    explain: boolean;
    team: {
        identifier: string;
    };
}
export interface GetResultResponse {
    jobIdentifier: string;
    accountIdentifier: string;
    team: {
        identifier: string;
    };
    total: number;
    completed: number;
    failed: number;
    finished: boolean;
    submittedByKey: string;
    explained: boolean;
    submittedAt: string;
    initialQueueTime: number;
    totalQueueTime: number;
    averageModelLatency: number;
    totalModelLatency: number;
    elapsedTime: number;
    startingResultSummarizing: string;
    resultSummarizing: number;
    inputSize: number;
    results: {
        job: {
            status: string;
            engine: string;
            inputFetching: number;
            outputUploading?: any;
            modelLatency: number;
            queueTime: number;
            startTime: string;
            updateTime: string;
            endTime: string;
            [key: string]: any;
            voting: {
                up: 0;
                down: 0;
            };
        };
    };
}
export {};
