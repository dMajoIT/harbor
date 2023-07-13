import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { OidcOnboardService } from './oidc-onboard.service';
import { UntypedFormControl } from '@angular/forms';
import { CommonRoutes } from '../shared/entities/shared.const';
import { errorHandler } from '../shared/units/shared.utils';

@Component({
    selector: 'app-oidc-onboard',
    templateUrl: './oidc-onboard.component.html',
    styleUrls: ['./oidc-onboard.component.scss'],
})
export class OidcOnboardComponent implements OnInit {
    url: string;
    redirectUrl: string;
    errorMessage: string = '';
    oidcUsername = new UntypedFormControl('');
    errorOpen: boolean = false;
    constructor(
        private oidcOnboardService: OidcOnboardService,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.redirectUrl = params['redirect_url'] || '';
            this.oidcUsername.setValue(params['username'] || '');
        });
    }
    clickSaveBtn(): void {
        this.oidcOnboardService
            .oidcSave({ username: this.oidcUsername.value })
            .subscribe(
                res => {
                    if (this.redirectUrl === '') {
                        // Routing to the default location
                        this.router.navigateByUrl(CommonRoutes.HARBOR_DEFAULT);
                    } else {
                        this.router.navigateByUrl(this.redirectUrl);
                    }
                },
                error => {
                    this.errorMessage = errorHandler(error);
                    this.errorOpen = true;
                }
            );
    }
    emptyErrorMessage() {
        this.errorOpen = false;
    }
    backHarborPage() {
        this.router.navigate([CommonRoutes.HARBOR_DEFAULT]);
    }
}
