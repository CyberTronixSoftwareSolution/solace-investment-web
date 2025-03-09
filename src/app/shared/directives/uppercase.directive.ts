import {
  Directive,
  ElementRef,
  HostListener,
  Renderer2,
  ChangeDetectorRef,
} from "@angular/core";
import { NgControl } from "@angular/forms";

@Directive({
  selector: "[appUppercase]",
})
export class UppercaseDirective {
  // constructor(
  //   private el: ElementRef,
  //   private renderer: Renderer2,
  //   private cdRef: ChangeDetectorRef
  // ) {}

  // @HostListener("input", ["$event"])
  // onInput(event: Event) {
  //   const inputElement = event.target as HTMLInputElement;
  //   const transformedValue = inputElement.value.toUpperCase();

  //   // Prevent cursor jump issue
  //   const start = inputElement.selectionStart;
  //   const end = inputElement.selectionEnd;

  //   this.renderer.setProperty(inputElement, "value", transformedValue);

  //   // Restore cursor position
  //   inputElement.setSelectionRange(start, end);

  //   // Mark for change detection to prevent ExpressionChangedAfterItHasBeenCheckedError
  //   this.cdRef.detectChanges();
  // }

  constructor(private control: NgControl) {}

  @HostListener("input", ["$event"])
  onInput(event: Event) {
    setTimeout(() => {
      const inputElement = event.target as HTMLInputElement;
      const transformedValue = inputElement.value.toUpperCase();

      // Update the form control value
      this.control.control?.setValue(transformedValue, { emitEvent: false });
    });
  }
}
