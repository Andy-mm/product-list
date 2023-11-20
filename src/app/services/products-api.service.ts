import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Product, ProductDto } from '../model';

type GetProductListResponse = { data: ProductDto[] };
type CreateProductResponse = { data: ProductDto };
type GetProductByIdResponse = { data: ProductDto };
type UpdateProductResponse = { data: ProductDto };
type DeleteProductResponse = { data: ProductDto };

@Injectable({
    providedIn: 'root'
})
export class ProductsApiService {
    constructor(
        private readonly httpClient: HttpClient
    ) { }

    getProductList(filterParams: Partial<ProductDto> = {}): Observable<ProductDto[]> {
        return this.httpClient.post<GetProductListResponse>('', { method: 'getProductList', filterParams })
            .pipe(
                map(response => response.data)
            );
    }

    getProductById(id: string): Observable<ProductDto> {
        return this.httpClient.post<GetProductByIdResponse>('', { method: 'getProductById', id })
            .pipe(
                map(response => response.data)
            );
    }

    createProduct(value: Omit<ProductDto, 'id'>): Observable<ProductDto> {
        return this.httpClient.post<CreateProductResponse>('', { method: 'createProduct', data: value })
            .pipe(
                map(response => response.data)
            );
    }

    updateProduct(productId: string, newValue: Omit<Product, 'id'>): Observable<ProductDto> {
        return this.httpClient.post<UpdateProductResponse>('', { method: 'updateProduct', id: productId, data: newValue })
            .pipe(
                map(response => response.data)
            );
    }

    deleteProduct(productId: string): Observable<ProductDto> {
        return this.httpClient.post<DeleteProductResponse>('', { method: 'deleteProduct', id: productId})
            .pipe(
                map(response => response.data)
            );
    }
}
