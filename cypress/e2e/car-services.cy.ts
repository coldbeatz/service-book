describe ('TS15-1 Адміністратор обирає автомобіль та переходить в регламентні обслуговування', () => {
	beforeEach(() => {
		cy.login('vbhrytsenko@gmail.com', '123123');
		cy.visit('/en/cars/4/13');
	});

	it ('Успішно відкривається сторінка з регламентними обслуговуваннями даного автомобіля', () => {
		cy.get('.left-panel').should('exist');

		cy.contains('button.btn-toggle', 'Regulations maintenance').click();

		cy.url().should('include', '/en/cars/4/13/maintenance');
	});
});

describe ('TS15-2 Адміністратор додає нове обслуговування для конкретного автомобіля', () => {
	beforeEach(() => {
		cy.login('vbhrytsenko@gmail.com', '123123');
		cy.visit('/en/cars/4/13/maintenance');
	});

	it ('Успішно додано обслуговування для конкретного автомобіля до БД', () => {
		const serviceNameEn = 'Test car-specific service ' + Date.now();
		const serviceNameUa = 'Тестове обслуговування авто ' + Date.now();

		cy.contains('Create maintenance').click();

		cy.get('p-floatlabel').each(($el) => {
			if ($el.find('label').text().includes('EN')) {
				cy.wrap($el).find('textarea').invoke('val', serviceNameEn).trigger('input');
			}

			if ($el.find('label').text().includes('UA')) {
				cy.wrap($el).find('textarea').invoke('val', serviceNameUa).trigger('input');
			}
		});

		cy.get('input#interval').clear().type('10000');

		cy.intercept('POST', '**/regulations_maintenance').as('saveService');
		cy.contains('button', 'Save changes').click();
		cy.wait('@saveService').its('response.statusCode').should('eq', 201);

		cy.get('.p-dialog').should('not.exist');

		cy.contains('Vehicle maintenance has been successfully saved').should('be.visible');
	});
});

describe ('TS15-3 Адміністратор змінює обслуговування для конкретного автомобіля', () => {
	beforeEach(() => {
		cy.login('vbhrytsenko@gmail.com', '123123');
		cy.visit('/en/cars/4/13/maintenance');
	});

	it ('Успішно змінено обслуговування для конкретного автомобіля в БД', () => {
		const updatedServiceNameEn = 'Updated service ' + Date.now();
		const updatedServiceNameUa = 'Оновлене обслуговування ' + Date.now();

		cy.get('table tbody tr').contains('td', 'Test car-specific service')
			.parent()
			.within(() => {
				cy.contains('button', 'Edit').click();
			});

		cy.get('.p-dialog').should('exist');

		cy.get('p-floatlabel').each(($el) => {
			if ($el.find('label').text().includes('EN')) {
				cy.wrap($el).find('textarea').clear().invoke('val', updatedServiceNameEn).trigger('input');
			}

			if ($el.find('label').text().includes('UA')) {
				cy.wrap($el).find('textarea').clear().invoke('val', updatedServiceNameUa).trigger('input');
			}
		});

		cy.get('input#interval').clear().type('20000');

		cy.intercept('PUT', '**/regulations_maintenance/**').as('updateMaintenance');
		cy.contains('button', 'Save changes').click();
		cy.wait('@updateMaintenance').its('response.statusCode').should('eq', 200);

		cy.get('.p-dialog').should('not.exist');

		cy.contains('td', updatedServiceNameEn, { timeout: 10000 }).should('exist');
		cy.contains('Vehicle maintenance has been successfully saved').should('be.visible');
	});
});

describe ('TS15-4 Адміністратор видаляє обслуговування для конкретного автомобіля', () => {
	beforeEach(() => {
		cy.login('vbhrytsenko@gmail.com', '123123');
		cy.visit('/en/cars/4/13/maintenance');
	});

	it ('Успішно видалено обслуговування для конкретного автомобіля з БД', () => {
		const serviceToDelete = 'To Delete';

		cy.contains('td', serviceToDelete)
			.parent('tr')
			.within(() => {
				cy.contains('button', 'Delete').click();
			});

		cy.contains('Are you sure you want to delete all vehicle maintenances?').should('exist');

		cy.intercept('DELETE', '**/regulations_maintenance/**').as('deleteMaintenance');
		cy.contains('button', 'Yes').click();
		cy.wait('@deleteMaintenance').its('response.statusCode').should('eq', 204);

		cy.contains('td', serviceToDelete, { timeout: 10000 }).should('not.exist');
		cy.contains('Vehicle maintenance has been successfully deleted').should('be.visible');
	});
});

describe ('TS15-5 Адміністратор видаляє всі обслуговування для конкретного автомобіля', () => {
	beforeEach(() => {
		cy.login('vbhrytsenko@gmail.com', '123123');
		cy.visit('/en/cars/4/13/maintenance');
	});

	it ('Успішно видалено всі обслуговування для конкретного автомобіля з БД', () => {
		cy.get('table tbody tr').should('exist');

		cy.intercept('DELETE', /\/cars\/\d+\/maintenance$/).as('deleteAllMaintenances');

		cy.contains('Clear all').click();
		cy.contains('Are you sure you want to delete all vehicle maintenances?').should('exist');
		cy.contains('button', 'Yes').click();

		cy.wait('@deleteAllMaintenances').its('response.statusCode').should('eq', 204);

		cy.get('table tbody tr').should('have.length', 0);
		cy.contains('All maintenance data of the current vehicle has been successfully deleted').should('be.visible');
	});
});

describe ('TS15-6 Адміністратор ініціалізує дефолтні регламентні обслуговування для автомобіля', () => {
	beforeEach(() => {
		cy.login('vbhrytsenko@gmail.com', '123123');
		cy.visit('/en/cars/4/13/maintenance');
	});

	it ('Успішно додано обслуговування для автомобіля в БД', () => {
		cy.intercept('GET', /\/cars\/\d+\/maintenance\/default$/).as('initializeDefaults');

		cy.contains('Initialize default').click();

		cy.wait('@initializeDefaults').its('response.statusCode').should('eq', 200);

		cy.get('table tbody tr').should('have.length.greaterThan', 0);
	});
});
