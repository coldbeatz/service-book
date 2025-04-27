describe ('TS07-6 Сторінка редагування автомобіля – Оновлення даних автомобіля', () => {
	beforeEach(() => {
		cy.login('vbhrytsenko@gmail.com', '123123');

		// Перехід одразу на сторінку редагування авто
		cy.visit('/en/user-cars/5');
	});

	it ('Повинно оновити дані автомобіля та отримати оновлений об’єкт від сервера', () => {
		cy.get('input#licensePlate').clear().type('NEW1234XX');
		cy.get('input#vinCode').clear().type('NEWVINCODE1234567');
		cy.get('input#vehicleYear').clear().type('2020');
		cy.get('input#vehicleMileage').clear().type('200000');

		cy.contains('button', 'Save changes').click();

		// Перевіряємо повідомлення про успішне оновлення
		cy.contains('The user car has been successfully updated').should('exist');

		// Перевіряємо, що значення полів оновились
		cy.get('input#licensePlate').should('have.value', 'NEW1234XX');
		cy.get('input#vinCode').should('have.value', 'NEWVINCODE1234567');
		cy.get('input#vehicleYear').should('have.value', '2020');
		cy.get('input#vehicleMileage').should('have.value', '200000');
	});
});

describe ('TS07-7 Додавання нового автомобіля користувачем', () => {
	beforeEach(() => {
		cy.login('vbhrytsenko@gmail.com', '123123');
		cy.visit('/en/user-cars/create');
	});

	it ('Повинно додати автомобіль з коректними даними та отримати створений об’єкт від сервера', () => {
		const randomVin = Array.from({ length: 17 }, () =>
			'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.charAt(Math.floor(Math.random() * 36))
		).join('');

		const randomLicensePlate = 'КА' + Math.floor(1000 + Math.random() * 9000) + 'IC';

		cy.get('p-select[ng-reflect-placeholder="Select car brand"]').find('span.p-select-label').click();
		cy.get('ul.p-select-list').should('be.visible').contains('li.p-select-option', 'Toyota').click();

		cy.get('p-select[ng-reflect-placeholder="Select car model"]').find('span.p-select-label').click();
		cy.get('ul.p-select-list').should('be.visible').contains('li.p-select-option', 'Land Cruiser 200').click();

		cy.get('input#licensePlate').type(randomLicensePlate);
		cy.get('input#vinCode').type(randomVin);
		cy.get('input#vehicleYear').type('2021');
		cy.get('input#vehicleMileage').type('100000');

		cy.get('p-select[ng-reflect-placeholder="Select transmission"]').find('span.p-select-label').click();
		cy.get('ul.p-select-list').should('be.visible').contains('li.p-select-option', 'Automatic').click();

		cy.get('p-select[ng-reflect-placeholder="Select fuel type"]').find('span.p-select-label').click();
		cy.get('ul.p-select-list').should('be.visible').contains('li.p-select-option', 'Petrol').click();

		cy.intercept('POST', '/user/cars').as('createCar');

		cy.contains('button', 'Save changes').click();

		cy.wait('@createCar').its('response.statusCode').should('eq', 201);
		cy.url().should('match', /\/user-cars\/\d+$/);
	});
});

describe ('TS07-8 Видалення автомобіля користувачем', () => {
	beforeEach(() => {
		cy.login('vbhrytsenko@gmail.com', '123123');
		cy.visit('/en/user-cars');
	});

	it ('Повинно успішно видалити автомобіль після підтвердження в модальному вікні', () => {
		const licensePlate = 'NEW1234XX';

		cy.login('vbhrytsenko@gmail.com', '123123');
		cy.visit('/en/user-cars');

		// Перевіряємо, чи є хоч один автомобіль перед видаленням
		cy.get('body').then(($body) => {
			if ($body.find('.card.user-car').length > 0) {
				// Якщо є машини, шукаємо потрібну
				cy.contains('.card.user-car', licensePlate)
					.parents('.card.user-car')
					.within(() => {
						cy.contains('a.btn.btn-danger', 'Delete car').click();
					});

				// Підтвердження модалки
				cy.contains('.p-dialog', 'Confirming deletion').should('be.visible');
				cy.get('button.p-confirmdialog-accept-button').contains('Yes').click();

				// Перевіряємо, що ця машина зникла
				cy.contains('.card.user-car', licensePlate).should('not.exist');
			} else {
				// Якщо машин немає — тест завершено (або кидаємо іншу помилку)
				cy.log('No cars available to delete.');
			}
		});
	});
});
