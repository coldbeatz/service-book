describe ('TS08-4 Оновлення нотатки автомобіля', () => {
	beforeEach(() => {
		cy.login('vbhrytsenko@gmail.com', '123123');
		cy.visit('/en/user-cars/8/notes/14');
	});

	it ('Повинно оновити нотатку з новими даними та отримати оновлений об’єкт від сервера', () => {
		cy.contains('a', 'Note editor').click();

		cy.get('input#short_description').clear().type('Note description');
		cy.get('.ql-editor').clear().type('Note content...');

		cy.contains('a', 'Save note').click();

		cy.contains('The note has been successfully updated').should('exist');
	});
});

describe ('TS08-5 Видалення нотатки автомобіля', () => {
	beforeEach(() => {
		cy.login('vbhrytsenko@gmail.com', '123123');
		cy.visit('/en/user-cars/8/notes/18');
	});

	it ('Повинно видалити нотатку після підтвердження в модальному вікні', () => {
		cy.contains('a', 'Delete note').click();

		cy.contains('.p-dialog-header', 'Confirming deletion').should('be.visible');
		cy.contains('.p-dialog-content', 'Are you sure you want to delete note?').should('exist');

		cy.contains('button', 'Yes').click();

		cy.contains('The note was successfully deleted').should('exist');
	});
});

describe ('TS08-6 Додавання нової нотатки користувачем', () => {
	beforeEach(() => {
		// Логін і перехід на сторінку створення нотатки для певного авто (id=8, наприклад)
		cy.login('vbhrytsenko@gmail.com', '123123');
		cy.visit('/en/user-cars/8/notes/new');
	});

	it ('Повинно створити нову нотатку з коректними даними та отримати створений об’єкт від сервера', () => {
		cy.get('input#short_description').clear().type('New note description');
		cy.get('.ql-editor').clear().type('Note content...');

		cy.contains('a.bootstrap-button', 'Save note').click();

		cy.contains('.card-title', 'New note description').should('exist');
		cy.contains('.card-text', 'Note content...').should('exist');
	});
});
