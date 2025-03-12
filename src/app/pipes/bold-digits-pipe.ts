import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	standalone: true,
	name: 'boldDigits'
})
export class BoldDigitsPipe implements PipeTransform {

	transform(value: string): string {
		if (!value)
			return '';

		return value.replace(/\b(?!0+\b)\d+\b/g, '<b>$&</b>');
	}
}
