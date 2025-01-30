import {Component, EventEmitter, Output, ViewEncapsulation} from "@angular/core";
import {NgIf} from "@angular/common";
import {AppTranslateModule} from "../../../translate/translate.module";

@Component({
	selector: 'custom-file-upload-root',
	encapsulation: ViewEncapsulation.None,
	templateUrl: 'custom-file-upload.component.html',
	styleUrls: ['custom-file-upload.component.scss'],
	imports: [
		NgIf,
		AppTranslateModule
	],
	standalone: true
})
export class CustomFileUploadComponent {

	selectedFileName: string | null = null;
	selectedFile: File | null = null;

	@Output() fileSelected = new EventEmitter<File | null>();

	onFileSelected(event: Event): void {
		const input = event.target as HTMLInputElement;

		if (input.files && input.files.length > 0) {
			this.selectedFile = input.files[0];
			this.selectedFileName = this.selectedFile.name;

			this.fileSelected.emit(this.selectedFile);
		} else {
			this.selectedFileName = this.selectedFileName = null;

			this.fileSelected.emit(null);
		}
	}
}
