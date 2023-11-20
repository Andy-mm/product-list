import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, combineLatest, map, Observable, of, switchMap, tap } from 'rxjs';
import { Product } from '../model';
import { ProductsApiService } from './products-api.service';
import { ProductDto } from '../model';

@Injectable({
    providedIn: 'root'
})
export class ProductsService {
    private refreshDataTrigger: BehaviorSubject<void> = new BehaviorSubject<void>(undefined);

    data$: Observable<Product[]> = combineLatest([this.refreshDataTrigger])
        .pipe(
            switchMap(() => this.api.getProductList()),
            map(products => products.map(item => this.mapDtoProduct(item))),
            catchError(error => {
                console.error(`Ошибка при получении списка товаров: ${error.message}`);

                return of([]);
            }),
            tap(() => this.loading$.next(false))
        );

    loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(
        private readonly api: ProductsApiService
    ) { }

    createProduct(value: Omit<Product, 'id'>): Observable<string> {
        this.loading$.next(true);

        return this.api.createProduct(value)
            .pipe(
                map(response => response.id),
                tap(() => this.refreshDataTrigger.next())
            )
    }

    updateProduct(productId: string, newValue: Omit<Product, 'id'>): Observable<ProductDto> {
        this.loading$.next(true);

        return this.api.updateProduct(productId, newValue)
            .pipe(
                tap(() => this.refreshDataTrigger.next())
            );
    }

    deleteProduct(productId: string): Observable<ProductDto> {
        this.loading$.next(true);

        return this.api.deleteProduct(productId)
            .pipe(
                tap(() => this.refreshDataTrigger.next())
            );
    }

    getProductById(id: string): Observable<ProductDto> {
        return this.api.getProductById(id);
    }

    private mapDtoProduct(product: ProductDto): Product {
        return { ...product };
    }
}
