import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

export function noWhitespaceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value && (control.value as string).includes(' ')) {
      return { whitespace: true };
    }
    return null;
  };
}
