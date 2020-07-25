import { AuthenticationService } from '@app/_services';

export function appInitializer(authenticationService: AuthenticationService) {
    return () => new Promise(resolve => {
        // attempt to refresh token on app start up to auto authenticate
        authenticationService.refreshToken()
            .subscribe()
            .add(resolve);
    });
}