import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, catchError, filter, map, Observable, of, switchMap, take } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductDto, ProductForm } from '../../model';
import { ProductsService } from '../../services/products.service';
import { ProductFormComponent } from '../product-form/product-form.component';
import { UniqVendorCodeValidator } from '../../validators/uniq-vendor-code.validator';

@Component({
    selector: 'app-editing-form',
    standalone: true,
    imports: [CommonModule, ProductFormComponent],
    templateUrl: './editing-form.component.html',
    styleUrls: ['./editing-form.component.scss']
})
export class EditingFormComponent {
    @Input() set editingProductId(id: string) {
        this.editingProductId$.next(id);
    }

    @Output()
    close: EventEmitter<void> = new EventEmitter<void>();

    editingProductId$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

    editingForm$: Observable<FormGroup<ProductForm>> = this.editingProductId$
        .pipe(
            filter(Boolean),
            switchMap(id => this.productsService.getProductById(id)),
            map((product: ProductDto) => this.getForm(product))
        )

    constructor(
        private readonly productsService: ProductsService,
        private readonly uniqVendorCodeValidator: UniqVendorCodeValidator
    ) { }

    onClickSave(form: FormGroup<ProductForm>): void {
        const productId = this.editingProductId$.value;
        if (!productId || form.invalid) return;

        const newValue = form.getRawValue();
        form.disable();
        this.productsService.updateProduct(
            productId,
            {
                name: newValue.name ?? '',
                vendorCode: newValue.vendorCode ?? '',
                description: newValue.description ?? '',
                price: newValue.price ?? 0
        })
            .pipe(
                catchError(error => {
                    console.error(error.message);

                    return of(null);
                }),
                take(1)
            )
            .subscribe((response: ProductDto | null) => {
                if (response) {
                    this.close.next();
                    return;
                }

                form.enable();
            })

    }

    onClickCancel(): void {
        this.close.next();
    }

    private getForm(value: ProductDto): FormGroup<ProductForm> {
        return new FormGroup({
            name: new FormControl<string | null>(value.name, [Validators.required]),
            vendorCode: new FormControl<string | null>(
                value.vendorCode,
                { asyncValidators:[this.uniqVendorCodeValidator.validate.bind({ ...this.uniqVendorCodeValidator, initialValue: value.vendorCode })] }
            ),
            description: new FormControl<string | null>(value.description, [Validators.required]),
            price: new FormControl<number | null>(value.price, [Validators.required, Validators.pattern(/^[0-9]+$/)])
        })
    }
}
