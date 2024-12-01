declare const renderGame: (options: RenderOptions) => void;
export default renderGame;

declare interface RenderOptions {
    creditsUrl: string;
    privacyPolicyUrl: string;
    assetsBasePath: string;
    fireBaseApiKey: string;
    fireBaseAuthDomain: string;
    fireBaseProjectId: string;
    fireBaseStorageBucket: string;
    fireBaseMessagingSenderId: string;
    fireBaseAppId: string;
}

export { }
