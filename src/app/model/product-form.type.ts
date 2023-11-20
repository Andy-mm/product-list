import { FormControl } from '@angular/forms';

export type ProductForm = {
    name: FormControl<string | null>;
    vendorCode: FormControl<string | null>;
    description: FormControl<string | null>;
    price: FormControl<number | null>;
}
