describe ('TS10-1 Створення новини адміністратором', () => {
	beforeEach(() => {
		cy.login('vbhrytsenko@gmail.com', '123123');
		cy.visit('/en/alerts');
	});

	it ('Повинно створити новину', () => {
		cy.contains('.panel-link', 'Create news').click();
		cy.get('.p-dialog-content').should('be.visible');

		cy.contains('label', 'Title').parent().find('textarea').type('Test News Title');

		cy.get('input#calendar-24h').type('2025-04-26 23:55{enter}');
		cy.get('.ql-editor').should('be.visible').click().type('Test news content');

		cy.contains('button', 'Save changes').click();

		cy.contains('The news has been successfully saved').should('exist');
	});
});

describe ('TS10-2 Редагування новини адміністратором', () => {
	beforeEach(() => {
		cy.login('vbhrytsenko@gmail.com', '123123');
		cy.visit('/en/alerts');
	});

	it ('Повинно відредагувати новину', () => {
		cy.contains('.panel-link', 'Test News Title').click();

		cy.get('.p-dialog-content').should('be.visible');

		cy.contains('label', 'Title').parent().find('textarea').clear().type('Updated News Title');
		cy.get('.ql-editor').clear().type('Updated news content');

		cy.contains('button', 'Save changes').click();

		cy.contains('The news has been successfully saved').should('exist');
	});
});

describe ('TS10-3 Адміністратор вмикає e-mail розсилку при редагуванні новини', () => {
	beforeEach(() => {
		cy.login('vbhrytsenko@gmail.com', '123123');
		cy.visit('/en/alerts');
	});

	it ('Повинно увімкнути e-mail розсилку при редагуванні новини', () => {
		cy.contains('.panel-link', 'Test News Title').click();

		cy.get('.p-dialog-content').should('be.visible');

		cy.contains('label', 'Title').parent().find('textarea').clear().type('Updated News Title');
		cy.get('.ql-editor').clear().type('Updated news content');

		cy.contains('.p-togglebutton-content', 'E-mail newsletter')
			.closest('button')
			.then(($btn) => {
				if ($btn.attr('aria-pressed') === 'false') {
					cy.wrap($btn).click();
				}
			});

		cy.contains('button', 'Save changes').click();

		cy.contains('The news has been successfully saved').should('exist');
	});
});
