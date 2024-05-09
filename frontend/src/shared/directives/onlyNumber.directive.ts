import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appOnlyNumber]',
  standalone: true
})
export class OnlyNumberDirective {
  constructor() {}
  @HostListener('input', ['$event']) onInputChange(event: any) {
    const initialValue = event.target.value;

    event.target.value = initialValue.replace(/[^0-9]*/g, '');
    event.target.value = String(event.target.value).replace(/^0+/, '');
    if (initialValue !== event.target.value) {
      event.stopPropagation();
    }
  }
}

