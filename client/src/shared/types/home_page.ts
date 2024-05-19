type HomePageTabParams = "text" | "image";

interface HomePageParams {
    tab?: HomePageTabParams;
    sourceLanguage?: string;
    targetLanguage?: string;
}

export type { HomePageParams, HomePageTabParams };
