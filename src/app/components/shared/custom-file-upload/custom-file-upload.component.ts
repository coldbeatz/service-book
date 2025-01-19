import {Component, EventEmitter, Output, ViewEncapsulation} from "@angular/core";

@Component({
	selector: 'custom-file-upload-root',
	encapsulation: ViewEncapsulation.None,
	templateUrl: './custom-file-upload.component.html',
	styleUrls: ['./custom-file-upload.component.scss'],
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
