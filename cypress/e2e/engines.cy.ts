describe ('TS13-1 Адміністратор відкриває список двигунів автомобіля', () => {
	beforeEach(() => {
		cy.login('vbhrytsenko@gmail.com', '123123');
		cy.visit('/en/cars/4/20');
	});

	it ('Успішно відкривається сторінка зі списком двигунів автомобіля', () => {
		cy.get('.left-panel').should('exist');

		cy.contains('button.btn-toggle', 'Engines').click();
		cy.contains('a.panel-link', 'View all').click();

		cy.url().should('include', '/en/cars/4/20/engines');
	});
});

describe ('TS13-2 Адміністратор додає новий двигун автомобіля', () => {
	beforeEach(() => {
		cy.login('vbhrytsenko@gmail.com', '123123');
		cy.visit('/en/cars/4/20/engines/create');
	});

	it ('Успішно додається двигун автомобіля до БД', () => {
		cy.get('input#name').type('Test Engine');

		cy.get('input#displacement').clear().type('4.0');

		cy.get('.p-select-label').click();
		cy.get('li[role="option"]').contains('Petrol').click();

		cy.get('input#horsepower').clear().type('300');

		cy.get('button[type="submit"]').should('not.be.disabled').click();

		cy.url().should('include', '/en/cars/4/20/engines');

		cy.contains('Test Engine').should('be.visible');
	});
});

describe ('TS13-3 Адміністратор редагує двигун автомобіля', () => {
	beforeEach(() => {
		cy.login('vbhrytsenko@gmail.com', '123123');
		cy.visit('/en/cars/4/20/engines/30');
	});

	it ('Успішно змінено двигун автомобіля в БД', () => {
		cy.get('input#name').clear().type('Updated Engine 3000');

		cy.get('input#displacement').clear().type('6.0');

		cy.get('.p-select-label').click();
		cy.get('li[role="option"]').contains('Diesel').click();

		cy.get('input#horsepower').clear().type('400');

		cy.get('button[type="submit"]').should('not.be.disabled').click();

		cy.contains('Car engine has been successfully saved').should('be.visible');
	});
});

describe ('TS13-4 Адміністратор видаляє двигун автомобіля', () => {
	const engineToDelete = 'Engine to delete';

	beforeEach(() => {
		cy.login('vbhrytsenko@gmail.com', '123123');
		cy.visit('/en/cars/4/20/engines');
	});

	it ('Успішно видалено двигун в БД', () => {
		cy.get('.engines__card')
			.contains(engineToDelete)
			.parents('.engines__card')
			.within(() => {
				cy.get('.btn-danger').contains('Delete').click();
			});

		cy.get('.p-confirmdialog').should('be.visible');
		cy.get('.p-confirmdialog-accept-button').click();

		cy.contains('.engine-card', engineToDelete).should('not.exist');
		cy.contains('The car engine was successfully deleted').should('be.visible');
	});
});
