import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductForm } from '../../model';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { filter, pairwise, Subscription } from 'rxjs';

@Component({
    selector: 'app-product-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './product-form.component.html',
    styleUrls: ['./product-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductFormComponent implements OnInit, OnDestroy{
    @Input()
    form: FormGroup<ProductForm> | null = null;

    private formPendingStateSubscription: Subscription | undefined;

    constructor(
        private readonly cdr: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.formPendingStateSubscription = this.form?.statusChanges
            .pipe(
                pairwise(),
                filter(([previousState]) => previousState === 'PENDING')
            )
            .subscribe(() => this.cdr.markForCheck());
    }

    ngOnDestroy(): void {
        this.formPendingStateSubscription?.unsubscribe();
    }
}
