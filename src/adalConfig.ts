import { AdalConfig, adalGetToken, AuthenticationContext, UserInfo } from 'react-adal';

// Endpoint URL
export const endpoint = 'https://cwcoltd.sharepoint.com/';
// App Registration ID
const appId = 'b12a4821-f6d1-403e-84af-473f9a5916ee';

export const adalConfig: AdalConfig = {
    cacheLocation: 'localStorage',
    clientId: appId,
    endpoints: {
        api:endpoint
    },
    postLogoutRedirectUri: window.location.origin,
    tenant: 'cwcoltd.onmicrosoft.com'
};

class AdalContext {
    private authContext: AuthenticationContext;
    
    constructor() {
        this.authContext = new AuthenticationContext(adalConfig);
    }

    get AuthContext() {
        return this.authContext;
    }

    public GetUser(): UserInfo {
        // probably need a condition here of what to do if this is called and
        // there is no user
        return this.authContext.getCachedUser()
    }

    public GetToken(): Promise<string | null> {
        return adalGetToken(this.authContext, endpoint);
    }

    public LogOut() {
        this.authContext.logOut();
    }
}

const adalContext: AdalContext = new AdalContext();
export default adalContext;