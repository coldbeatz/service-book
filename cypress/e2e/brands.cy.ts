describe ('TS11-1 Адміністратор натискає на кнопку автомобілів в меню', () => {
	beforeEach(() => {
		cy.login('vbhrytsenko@gmail.com', '123123');
		cy.visit('/en/brands');
	});

	it ('Успішно відкривається сторінка з брендами автомобілів', () => {
		cy.url().should('include', '/en/brands');
		cy.contains('Brands').should('be.visible');
	});
});

describe ('TS11-2: Фільтрація марок автомобілів за країною', () => {
	beforeEach(() => {
		cy.login('vbhrytsenko@gmail.com', '123123');
		cy.visit('/en/brands');
	});

	it ('Повинно фільтрувати марки автомобілів за країною', () => {
		cy.get('button[data-bs-toggle="dropdown"]')
			.filter(':visible')
			.first()
			.scrollIntoView()
			.should('be.visible')
			.click();

		cy.contains('li', 'Japan')
			.click();
	});
});

describe ('TS11-3 Адміністратор вводить назву бренду автомобіля в поле пошуку', () => {
	beforeEach(() => {
		cy.login('vbhrytsenko@gmail.com', '123123');
		cy.visit('/en/brands');
	});

	it('Бренди автомобілів успішно відфільтровано за назвою', () => {
		cy.get('.brands__card').should('have.length.greaterThan', 0);

		cy.get('input[placeholder="Enter car brand"]').type('Toyota');

		// Wait filtering process
		cy.wait(1000);

		cy.get('.brands__card').each(($card) => {
			if ($card.find('.card-title').text().includes('Toyota')) {
				cy.wrap($card).should('be.visible');
			} else {
				cy.wrap($card).should('not.be.visible');
			}
		});
	});
});
