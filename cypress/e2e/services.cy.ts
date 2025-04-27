describe ('TS14-1 Адміністратор натиснув на кнопку обслуговувань в меню', () => {
	beforeEach(() => {
		cy.login('vbhrytsenko@gmail.com', '123123');
		cy.visit('/en');
	});

	it ('Успішно відкривається сторінка з дефолтними регулярними обслуговуваннями', () => {
		cy.get('body').then($body => {
			if ($body.find('#menu-button').length) {
				cy.get('#menu-button').click();
			}
		});

		cy.contains('a.nav-link', 'Service Types').click({ force: true });

		cy.url().should('include', '/en/services');
		cy.contains('Services').should('exist');
	});
});

describe ('TS14-2 Адміністратор натиснув на заголовок таблиці для сортування списку за назвою', () => {
	beforeEach(() => {
		cy.login('vbhrytsenko@gmail.com', '123123');
		cy.visit('/en/services');
	});

	it ('Сортується список обслуговувань за назвою', () => {
		cy.get('th[psortablecolumn="workDescription.en"]').click();

		cy.get('table tbody tr td:nth-child(2)')
			.then($cells => {
				const names = [...$cells].map(cell => cell.innerText.trim().replace(/\s+/g, ' '));
				const sortedNames = [...names].sort((a, b) => a.localeCompare(b));
				expect(names).to.deep.equal(sortedNames);
			});
	});
});

describe ('TS14-3 Адміністратор вводить в поле пошуку текст регламентного обслуговування', () => {
	beforeEach(() => {
		cy.login('vbhrytsenko@gmail.com', '123123');
		cy.visit('/en/services');
	});

	it ('Список регламентних обслуговувань відфільтрується за вказаним текстом', () => {
		const searchText = 'Fuel filter';

		cy.get('input[type="text"]').first().type(searchText);

		cy.get('table tbody tr').should('have.length.greaterThan', 0);
	});
});

describe ('TS14-4 Адміністратор додає нове обслуговування, ввівши коректні дані', () => {
	beforeEach(() => {
		cy.login('vbhrytsenko@gmail.com', '123123');
		cy.visit('/en/services');
	});

	it ('Успішно додано обслуговування до БД', () => {
		const serviceNameEn = 'Test service ' + Date.now();
		const serviceNameUa = 'Тестове обслуговування ' + Date.now();

		cy.contains('Create new').click();

		cy.get('p-floatlabel').each(($el) => {
			if ($el.find('label').text().includes('EN')) {
				cy.wrap($el).find('textarea').invoke('val', serviceNameEn).trigger('input');
			}

			if ($el.find('label').text().includes('UA')) {
				cy.wrap($el).find('textarea').invoke('val', serviceNameUa).trigger('input');
			}
		});

		cy.get('input#useDefaultSwitch').check({ force: true });
		cy.get('input#interval').clear().type('10000');

		cy.intercept('POST', '**/regulations_maintenance').as('saveService');
		cy.contains('button', 'Save changes').click();
		cy.wait('@saveService').its('response.statusCode').should('eq', 201);

		cy.get('.p-dialog').should('not.exist');

		cy.contains('Regulation maintenance has been successfully saved').should('be.visible');
	});
});

describe ('TS14-5 Адміністратор змінює обслуговування, ввівши коректні дані', () => {
	beforeEach(() => {
		cy.login('vbhrytsenko@gmail.com', '123123');
		cy.visit('/en/services');
	});

	it ('Успішно змінено обслуговування в БД', () => {
		const updatedServiceNameEn = 'Updated service ' + Date.now();
		const updatedServiceNameUa = 'Оновлене обслуговування ' + Date.now();

		// Пошук обслуговування в таблиці та натискання Edit
		cy.get('table tbody tr').contains('td', '123')
			.parent()
			.within(() => {
				cy.contains('button', 'Edit').click();
			});

		cy.get('p-floatlabel').each(($el) => {
			if ($el.find('label').text().includes('EN')) {
				cy.wrap($el).find('textarea').clear().invoke('val', updatedServiceNameEn).trigger('input');
			}

			if ($el.find('label').text().includes('UA')) {
				cy.wrap($el).find('textarea').clear().invoke('val', updatedServiceNameUa).trigger('input');
			}
		});

		cy.intercept('PUT', '**/regulations_maintenance/**').as('updateService');
		cy.contains('button', 'Save changes').click();
		cy.wait('@updateService').its('response.statusCode').should('eq', 200);

		cy.get('.p-dialog').should('not.exist');
		cy.contains('td', updatedServiceNameEn, { timeout: 10000 }).should('exist');

		cy.contains('Regulation maintenance has been successfully saved').should('be.visible');
	});
});

describe ('TS14-6 Адміністратор видадяє обслуговування, підтвердивши видалення в модальному вікні', () => {
	beforeEach(() => {
		cy.login('vbhrytsenko@gmail.com', '123123');
		cy.visit('/en/services');
	});

	it ('Обслуговування успішно видалено з БД', () => {
		const serviceName = '321';

		cy.contains('td', serviceName)
			.parent('tr')
			.within(() => {
				cy.contains('button', 'Delete').click();
			});

		cy.contains('button', 'Yes').click();

		cy.contains('td', serviceName, { timeout: 10000 }).should('not.exist');
		cy.contains('Regulation maintenance has been successfully deleted').should('be.visible');
	});
});
