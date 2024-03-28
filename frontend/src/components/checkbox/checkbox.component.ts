import {Component, EventEmitter, forwardRef, Input, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
  selector: 'app-checkbox',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true
    }
  ],
})
export class CheckboxComponent implements ControlValueAccessor {
  @Output() onChanged = new EventEmitter<string>();
  change(value:string) {
    this.onChanged.emit(value);
  }
  @Input() groupName: string = '';
  @Input() value: any;
  isDisabled: boolean = false;
  isChecked: boolean = false;
  isTouched: boolean = false;


  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  handleClick(): void {
    if (!this.isChecked) {
      this.isChecked = true;
      this.change(this.value)
      this.onChange(this.value);
      this.handleTouch();
    } else {
      this.isChecked = false;
      this.onChange(null);
    }
  }

  handleTouch(): void {
    if (!this.isTouched) {
      this.onTouched();
      this.isTouched = true;
    }
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  writeValue(value: any): void {
    this.isChecked = value === this.value;
    this.change(this.value)
    this.onChange(this.isChecked ? this.value : null);
  }

  setDisabledState(isDisabled: boolean) {
    this.isDisabled = isDisabled;
  }
}

