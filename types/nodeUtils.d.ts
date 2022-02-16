/// <reference types="node" />
export declare function humanReadToBytes(humanSize: string): number;
export declare function fileToChunks(filePath: string, size: number): AsyncGenerator<Buffer, void, unknown>;
export declare function byteArrayToChunks(byteArray: any, size: number): AsyncGenerator<any, void, unknown>;
