import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../model';

@Component({
  selector: 'app-list-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListItemComponent {
    @Input()
    itemData?: Product;
}
