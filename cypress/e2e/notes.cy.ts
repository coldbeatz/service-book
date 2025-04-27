describe('TS08-1 Відкриття вкладки з нотатками автомобіля', () => {
	beforeEach(() => {
		cy.login('vbhrytsenko@gmail.com', '123123');
		cy.visit('/en/user-cars/8');
	});

	it ('Повинно відкрити сторінку нотаток обраного автомобіля', () => {
		cy.contains('button.btn-toggle', 'Notes').click();

		// Перевіряємо, що з'явилися елементи вкладки нотаток
		cy.contains('a.panel-link', 'View all').should('exist');
		cy.contains('a.panel-link', 'Create note').should('exist');
	});
});

describe ('TS08-2 Сортування нотаток обраного автомобіля', () => {
	beforeEach(() => {
		cy.login('vbhrytsenko@gmail.com', '123123');
		cy.visit('/en/user-cars/8');
	});

	it ('Повинно відкрити список нотаток (View all)', () => {
		cy.contains('button.btn-toggle', 'Notes').click();
		cy.contains('a.panel-link', 'View all').click();

		cy.url().should('include', '/notes');
	});
});

describe('TS08-3 Фільтрування нотаток користувача', () => {
	beforeEach(() => {
		cy.login('vbhrytsenko@gmail.com', '123123');
		cy.visit('/en/user-cars/8/notes');
	});

	it ('Повинно відфільтрувати нотатки за введеним текстом', () => {
		cy.get('input[placeholder="Enter text"]').type('New Note');

		cy.get('.p-dataview-content')
			.should('not.contain', 'Updated description');

		cy.contains('.panel-link', 'New Note').should('be.visible');
	});
});
