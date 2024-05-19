interface IUser {
    id: string;
    email: string;
    name: string;
    surname: string;
    createdAt: string;
    updatedAt: string;
}

enum ETranslationStatus {
    UNPROCESSED = "unprocessed",
    PROCESSING = "processing",
    TRANSLATED = "translated",
    ERROR = "error",
}

enum ETranslationType {
    TEXT = "text",
    IMAGE = "image",
}

interface ITranslation {
    id: string;
    status: ETranslationStatus;
    type: ETranslationType;
    path?: string;
    sourceLanguage: string;
    sourceText: string;
    targetLanguage: string;
    translatedText?: string;
    createdAt: string;
    updatedAt: string;
}

interface ILanguage {
    [key: string]: string;
}

export type { IUser, ITranslation, ILanguage };
