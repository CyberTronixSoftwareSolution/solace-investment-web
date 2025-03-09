// shared.module.ts

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CurrencyConverterPipe } from "./shared/pipes/currency-converter.pipe";
import { TruncatePipe } from "./shared/pipes/truncate.pipe";
import { DateConverterPipe } from "./shared/pipes/date-converter.pipe";
import { DateAgoPipe } from "./shared/pipes/date-ago.pipe";
import { UppercaseDirective } from "./shared/directives/uppercase.directive";

@NgModule({
  declarations: [
    CurrencyConverterPipe,
    TruncatePipe,
    DateConverterPipe,
    DateAgoPipe,
    UppercaseDirective,
  ],
  imports: [CommonModule],
  exports: [
    CurrencyConverterPipe,
    TruncatePipe,
    DateConverterPipe,
    DateAgoPipe,
    UppercaseDirective,
  ],
})
export class SharedModule {}
