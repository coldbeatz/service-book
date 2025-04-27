describe ('TS12-5 Адміністратор додає новий автомобіль, ввівши всі вірні дані', () => {
	const carModel = 'Test Model ' + Date.now();

	beforeEach(() => {
		cy.login('vbhrytsenko@gmail.com', '123123');
		cy.visit('/en/cars/4/create');
	});

	it ('Успішно додано автомобіль до БД', () => {
		cy.get('input[formcontrolname="model"]').type(carModel).should('have.value', carModel);
		cy.get('input#startYear').clear().type('2020').should('have.value', '2020');
		cy.get('input#endYear').clear().type('2025').should('have.value', '2025');

		cy.get('.create-car__transmissions label').contains('Manual').prev('input[type="checkbox"]')
			.check({ force: true });

		cy.get('.create-car__transmissions label').contains('Automatic').prev('input[type="checkbox"]')
			.check({ force: true });

		cy.get('input[type="file"]').selectFile('cypress/fixtures/cat-is-car.jpg', { force: true });
		cy.get('.file-name').should('not.contain', 'File not selected');

		cy.intercept('POST', 'http://localhost:8081/cars?brandId=4').as('createCar');

		cy.get('button[type="submit"]').should('not.be.disabled').click();

		// Перевірка відповіді від сервера
		cy.wait('@createCar').then((interception) => {
			expect(interception.response?.statusCode).to.eq(201);
			expect(interception.response?.body).to.have.property('id');
			expect(interception.response?.body.model).to.eq(carModel);
		});

		cy.url().should('match', /\/en\/cars\/4\/\d+$/);

		cy.contains(carModel).should('exist');
		cy.contains('Changes saved successfully').should('exist');
	});
});

describe ('TS12-6 Адміністратор редагує автомобіль, ввівши всі вірні дані', () => {
	beforeEach(() => {
		cy.login('vbhrytsenko@gmail.com', '123123');
		cy.visit('/en/cars/4/13');
	});

	it ('Успішно змінено автомобіль в БД', () => {
		cy.intercept('PUT', /\/cars\/\d+$/).as('updateCar');

		cy.get('input#model').clear().type('Updated Car Model');

		cy.get('input#startYear').clear().type('2021');
		cy.get('input#endYear').clear().type('2025');

		cy.get('.create-car__transmissions label').contains('Manual').prev('input[type="checkbox"]')
			.check({ force: true });

		cy.get('.create-car__transmissions label').contains('CVT').prev('input[type="checkbox"]')
			.check({ force: true });

		cy.get('button[type="submit"]').should('not.be.disabled').click();

		cy.wait('@updateCar').its('response.statusCode').should('eq', 200);

		cy.url().should('include', '/en/cars/4/13');
		cy.contains('Changes saved successfully').should('exist');
	});
});

describe ('TS12-7 Адміністратор видаляє автомобіль', () => {
	const carModelToDelete = 'Test Model 1745738202470';

	beforeEach(() => {
		cy.login('vbhrytsenko@gmail.com', '123123');
		cy.visit('/en/cars/4');
	});

	it ('Автомобіль успішно видалено з БД', () => {
		cy.intercept('DELETE', /\/cars\/\d+$/).as('deleteCar');

		// Шукаємо картку з потрібною назвою моделі
		cy.get('.cars__card').contains(carModelToDelete)
			.parents('.cars__card')
			.within(() => {
				cy.get('.btn-danger').click();
			});

		cy.get('.p-confirmdialog').should('be.visible');
		cy.get('.p-confirmdialog-accept-button').click();

		cy.wait('@deleteCar').its('response.statusCode').should('eq', 204);

		// Перевіряємо, що ця модель більше не відображається
		cy.get('.cars__card').contains(carModelToDelete).should('not.exist');

		cy.contains('The car was successfully deleted').should('exist');
	});
});

describe('TS12-8 Адміністратор не може видалити автомобіль, якщо він використовується користувачами', () => {
	beforeEach(() => {
		cy.login('vbhrytsenko@gmail.com', '123123');
		cy.visit('/en/cars/4');
	});

	it('Програма повертає помилку про неможливість видалення автомобіля', () => {
		cy.intercept('DELETE', /\/cars\/\d+$/).as('deleteCar');

		cy.get('.cars__card')
			.contains('Updated Car Model')
			.parents('.cars__card')
			.within(() => {
				cy.get('.btn-danger').click();
			});

		cy.get('.p-confirmdialog').should('be.visible');
		cy.get('.p-confirmdialog-accept-button').click();

		cy.wait('@deleteCar').its('response.statusCode').should('eq', 409);

		cy.contains('The car can\'t be delete, it has dependencies').should('be.visible');
	});
});
