// shared.module.ts

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CurrencyConverterPipe } from "./shared/pipes/currency-converter.pipe";
import { TruncatePipe } from "./shared/pipes/truncate.pipe";
import { DateConverterPipe } from "./shared/pipes/date-converter.pipe";
import { DateAgoPipe } from "./shared/pipes/date-ago.pipe";

@NgModule({
  declarations: [
    CurrencyConverterPipe,
    TruncatePipe,
    DateConverterPipe,
    DateAgoPipe,
  ],
  imports: [CommonModule],
  exports: [
    CurrencyConverterPipe,
    TruncatePipe,
    DateConverterPipe,
    DateAgoPipe,
  ],
})
export class SharedModule {}
