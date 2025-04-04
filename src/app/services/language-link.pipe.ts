import { Pipe, PipeTransform } from '@angular/core';
import { LanguageService } from "./language.service";

@Pipe({ name: 'langLink', standalone: true })
export class LanguageLinkPipe implements PipeTransform {

	constructor(private languageService: LanguageService) {}

	transform(url: string | any[]): any[] {
		const lang = this.languageService.language;

		return Array.isArray(url) ? ['/', lang, ...url] : ['/', lang, url];
	}
}
