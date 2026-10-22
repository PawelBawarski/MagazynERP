import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Stanowi stronę startową chronionego obszaru roboczego StockFlow.
 * Wyświetla wprowadzenie do pustego jeszcze pulpitu; nie przedstawia fikcyjnych danych ERP.
 */
@Component({
  selector: 'app-dashboard',
  imports: [TranslatePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {}
