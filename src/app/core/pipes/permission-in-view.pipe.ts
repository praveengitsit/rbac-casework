/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'permissionInView' })
export class PermissionInViewPipe implements PipeTransform {
  transform(value: string): any {
    if (!value) {
      return value;
    }

    const splitValue = value.split('_');
    const transformedValue = splitValue.join(' ');
    return transformedValue;
  }
}
