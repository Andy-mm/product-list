import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductFormComponent } from '../product-form/product-form.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductForm } from '../../model';
import { ProductsService } from '../../services/products.service';
import { catchError, of, take } from 'rxjs';
import { UniqVendorCodeValidator } from '../../validators/uniq-vendor-code.validator';

@Component({
    selector: 'app-creation-form',
    standalone: true,
    imports: [CommonModule, ProductFormComponent],
    templateUrl: './creation-form.component.html',
    styleUrls: ['./creation-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreationFormComponent {
    @Output()
    close: EventEmitter<void> = new EventEmitter<void>();

    creationForm: FormGroup<ProductForm> = this.getForm();

    constructor(
        private readonly productsService: ProductsService,
        private readonly uniqVendorCodeValidator: UniqVendorCodeValidator
    ) {}

    onClickSave(): void {
        const productValue = this.creationForm.getRawValue();
        this.creationForm.disable();

        this.productsService.createProduct({
            name: productValue.name ?? '',
            vendorCode: productValue.vendorCode ?? '',
            description: productValue.description ?? '',
            price: productValue.price ?? 0
        })
            .pipe(
                catchError(error => {
                    console.error(error.message);

                    return of(null);
                }),
                take(1)
            )
            .subscribe((response: string | null) => {
                if (response) {
                    this.close.next();
                    return;
                }

                this.creationForm.enable();
            })
    }

    onClickCancel(): void {
        this.close.next();
    }

    private getForm(): FormGroup<ProductForm> {
        return new FormGroup({
            name: new FormControl<string | null>(null, [Validators.required]),
            vendorCode: new FormControl<string | null>(null, { asyncValidators:[this.uniqVendorCodeValidator.validate.bind(this.uniqVendorCodeValidator)] }),
            description: new FormControl<string | null>(null, [Validators.required]),
            price: new FormControl<number | null>(null, [Validators.required, Validators.pattern(/^[0-9]+$/)])
        })
    }
}
