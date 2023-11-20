import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor, HttpResponse
} from '@angular/common/http';
import { delay, Observable, of } from 'rxjs';
import { PRODUCTS_MOCK_DATA } from '../constants/mocks/products.const';
import { ProductDto } from '../model';

type ProductRequest = { method: 'createProduct'; data: ProductDto }
    | { method: 'getProductList', filterParams?: Partial<ProductDto> }
    | { method: 'updateProduct', id: string, data: ProductDto }
    | { method: 'deleteProduct', id: string }
    | { method: 'getProductById', id: string };


@Injectable()
export class BackendMockInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<ProductRequest>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const fakeResponseData = { status: 200, body: {} };

        switch (request.body?.method) {
            case 'getProductList':
                const vendorCodeFilterParam = request.body.filterParams?.vendorCode;
                fakeResponseData.body = {
                    data: vendorCodeFilterParam
                        ? PRODUCTS_MOCK_DATA.filter(product => product.vendorCode === vendorCodeFilterParam)
                        : PRODUCTS_MOCK_DATA
                };
                break;

            case 'createProduct':
                const newProduct = { ...request.body.data, id: `p${Math.random()}`};
                PRODUCTS_MOCK_DATA.push(newProduct);
                fakeResponseData.body = { data: newProduct };
                break;

            case 'updateProduct':
                const updatedItemId: string = request.body.id;
                const updatedItemIndex = PRODUCTS_MOCK_DATA.findIndex(item => item.id === updatedItemId);
                const newValue = { ...request.body.data, id: updatedItemId };
                if (updatedItemIndex < 0) {
                    fakeResponseData.status = 500;
                    break;
                }

                PRODUCTS_MOCK_DATA.splice(updatedItemIndex, 1, newValue);
                fakeResponseData.body = { data: newValue };
                break;

            case 'deleteProduct':
                const deletedItemId: string = request.body.id;
                const deletedItemIndex = PRODUCTS_MOCK_DATA.findIndex(item => item.id === deletedItemId);
                if (deletedItemIndex < 0) {
                    fakeResponseData.status = 500;
                    break;
                }

                const [deletedItem] = PRODUCTS_MOCK_DATA.splice(deletedItemIndex, 1);
                fakeResponseData.body = { data: deletedItem };
                break;

            case 'getProductById':
                const searchedItemId: string = request.body.id;
                const searchedItem = PRODUCTS_MOCK_DATA.find(item => item.id === searchedItemId);
                if (!searchedItem) {
                    fakeResponseData.status = 500;
                    break;
                }

                fakeResponseData.body = { data: searchedItem }
        }

        return of(new HttpResponse(fakeResponseData))
            .pipe(delay(300));
    }
}
