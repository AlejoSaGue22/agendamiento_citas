import { inject } from "@angular/core";
import { CanMatchFn, Router } from "@angular/router";
import { firstValueFrom } from "rxjs";
import { AuthService } from "../services/auth.service";

export const notAuthenticatedGuard: CanMatchFn = async (route, segments) => {

    const authServices = inject(AuthService);
    const router = inject(Router);

    const isAuthenticated = await firstValueFrom(authServices.checkStatus());

    if (isAuthenticated) {
        router.navigateByUrl('/panel');
        return false;
    }

    return true;
};