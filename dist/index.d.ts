declare const renderGame: (options: RenderOptions) => void;
export default renderGame;

declare interface RenderOptions {
    creditsUrl: string;
    privacyPolicyUrl: string;
    assetsBasePath: string;
}

export { }
