describe('TS07-1 Сторінка автомобілів користувача – Перехід по меню', () => {
	beforeEach(() => {
		cy.login('vbhrytsenko@gmail.com', '123123');
		cy.visit('/en/profile');
	});

	it ('Повинно перейти на сторінку автомобілів користувача через меню', () => {
		cy.get('input[name="email"]').should('exist');

		cy.get('body').then($body => {
			if ($body.find('#menu-button').length) {
				cy.get('#menu-button').click();
			}
		});

		cy.contains('a.nav-link', 'My cars').click({ force: true });

		cy.url().should('include', '/en/user-cars');
		cy.contains('My cars').should('exist');
	});
});

describe ('TS07-2 Сторінка автомобілів користувача – Пошук за номерним знаком', () => {
	beforeEach(() => {
		cy.login('vbhrytsenko@gmail.com', '123123');
		cy.visit('/en/user-cars');
	});

	it ('Повинно відфільтрувати автомобілі за введеним номером', () => {
		// Переконуємося, що поле пошуку існує
		cy.get('input[placeholder="Enter data"]').should('exist');

		cy.get('input[placeholder="Enter data"]').type('AA1234BB');

		// Перевіряємо, що в списку з’явився потрібний автомобіль
		cy.get('.btn-toggle__nav li span')
			.filter((index, el) => el.innerText.trim() === 'AA1234BB')
			.should('have.length', 1);
	});
});

describe ('TS07-3 Сторінка автомобілів користувача – Пошук за VIN кодом', () => {
	beforeEach(() => {
		cy.login('vbhrytsenko@gmail.com', '123123');
		cy.visit('/en/user-cars');
	});

	it ('Повинно відфільтрувати автомобілі за введеним VIN кодом', () => {
		// Переконуємося, що поле пошуку існує
		cy.get('input[placeholder="Enter data"]').should('exist');

		cy.get('input[placeholder="Enter data"]').type('1HGCM82633A004352');

		// Перевіряємо, що в списку з’явився потрібний автомобіль
		cy.get('.card.user-car .card-body .text-muted')
			.filter((index, el) => el.innerText.includes('1HGCM82633A004352'))
			.should('have.length', 1);
	});
});

describe ('TS07-4 Сторінка автомобілів користувача – Пошук за маркою автомобіля', () => {
	beforeEach(() => {
		cy.login('vbhrytsenko@gmail.com', '123123');
		cy.visit('/en/user-cars');
	});

	it ('Повинно відфільтрувати автомобілі за введеною маркою', () => {
		// Переконуємося, що поле пошуку існує
		cy.get('input[placeholder="Enter data"]').should('exist');

		cy.get('input[placeholder="Enter data"]').type('Toyota');

		cy.get('.card.user-car .card-body .card-title')
			.filter((index, el) => el.innerText.includes('Toyota'))
			.should('have.length', 2);
	});
});

describe ('TS07-5 Сторінка автомобілів користувача – Пошук за моделлю автомобіля', () => {
	beforeEach(() => {
		cy.login('vbhrytsenko@gmail.com', '123123');
		cy.visit('/en/user-cars');
	});

	it ('Повинно відфільтрувати автомобілі за введеною моделлю автомобіля', () => {
		// Переконуємося, що поле пошуку існує
		cy.get('input[placeholder="Enter data"]').should('exist');

		cy.get('input[placeholder="Enter data"]').type('Land Cruiser 200');

		// Перевіряємо, що в списку з’явився потрібний автомобіль
		cy.get('.card.user-car .card-body .card-text')
			.filter((index, el) => el.innerText.includes('Land Cruiser 200'))
			.should('have.length', 1);
	});
});
