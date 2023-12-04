import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneNumber'
})
export class PhoneNumberPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    if (typeof value !== 'string') return value;
    let returnString = value.replace(/\D/g, '');
    if(returnString.length === 10){
      returnString = returnString.replace(/(\d{3})(\d{3})(\d{4})/, '($1)-$2-$3'); 
    }
    return returnString;
  }
}
