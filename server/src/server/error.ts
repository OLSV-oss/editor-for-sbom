export class SpdxTvExtentionError extends Error {
    get name(): string {
        return this.constructor.name;
    }
}

export class NotCoveredFileError extends SpdxTvExtentionError {
    constructor() {
        super("This file is not covered by Spdx Language Server.");
    }
}

export class CommandNotFoundError extends SpdxTvExtentionError {
    constructor(command: string) {
        super(`Command '${command}' not found`);
    }
}

export class WrongCommandArgumentsError extends SpdxTvExtentionError {
    constructor() {
        super("Arguments of the command are wrong.");
    }
}
