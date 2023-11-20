import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { Observable, take } from 'rxjs';
import { Product } from '../../model';
import { AsyncPipe, NgClass, NgForOf } from '@angular/common';
import { ListItemComponent } from '../list-item/list-item.component';

@Component({
    selector: 'app-list',
    standalone: true,
    templateUrl: './list.component.html',
    imports: [
        NgForOf,
        AsyncPipe,
        ListItemComponent,
        NgClass
    ],
    styleUrls: ['./list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent {
    @Input()
    selectedItemId: string | null = null;

    @Input()
    disabled: boolean = false;

    @Output()
    selectedItemIdChange: EventEmitter<string | null> = new EventEmitter<string | null>();

    products$: Observable<Product[]> = this.productsService.data$;

    loading$ = this.productsService.loading$;

    constructor(
        private readonly productsService: ProductsService
    ) { }

    editButtonClicked(productId: string): void {
        this.selectedItemIdChange.next(productId);
    }

    deleteButtonClicked(productId: string): void {
        this.productsService.deleteProduct(productId)
            .pipe(
                take(1)
            )
            .subscribe()
    }

    trackByFn = (index: number, item: Product): string => item.id;
}
