import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { ProductsApiService } from '../services/products-api.service';
import { catchError, map, Observable, of } from 'rxjs';
import { AsyncValidatorWithInitialState } from '../model';

@Injectable({
    providedIn: 'root'
})
export class UniqVendorCodeValidator implements AsyncValidator, AsyncValidatorWithInitialState<string | null> {
    initialValue: string | null = null;

    constructor(
        private readonly productsApiService: ProductsApiService
    ) { }

    validate(control: AbstractControl<string | null>): Observable<ValidationErrors | null> {
        const value = control.value;
        if (value === this.initialValue || !value) return of(null);

        return this.productsApiService.getProductList({ vendorCode: value! })
            .pipe(
                map(products => products.length === 0 ? null : { notUniq: true }),
                catchError(() => of({ notUniq: true }))
            );
    }
}
