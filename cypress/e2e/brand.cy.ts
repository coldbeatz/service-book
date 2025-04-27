describe ('Управління брендом - Створення бренду', () => {

	const brandName = 'Toyota Test ' + Date.now();

	beforeEach(() => {
		cy.login('v.o.hrytsenko@student.khai.edu', '123123');
		cy.visit('/en/brands/create');
	});

	it ('TS11-4: Адміністратор успішно створює новий бренд автомобіля', () => {
		cy.get('input[name="brandName"]').type(brandName).should('have.value', brandName);

		cy.get('.dropdown-country button').click();
		cy.contains('.dropdown-item', 'Japan').click();
		cy.get('.dropdown-country button').should('contain.text', 'Japan');

		cy.get('input[type="file"]').selectFile(`cypress/fixtures/test-brand.jpg`, { force: true });
		cy.get('.file-name').should('not.contain', 'File not selected');

		cy.intercept('POST', '**/brands').as('createBrand');

		cy.get('button[type="submit"]').should('not.be.disabled').click();

		// Перевірка відповіді від сервера
		cy.wait('@createBrand').then((interception) => {
			expect(interception.response?.statusCode).to.eq(201);
			expect(interception.response?.body).to.have.property('id');
			expect(interception.response?.body.brand).to.eq(brandName);
		});

		// Перевіряє, що URL має /en/brands/{id}
		cy.url().should('match', /\/en\/brands\/\d+$/);

		cy.get('input[name="brandName"]').should('have.value', brandName);
	});
});

describe ('Управління брендом - Редагування бренду', () => {

	const newBrandName = 'Toyota Edited ' + Date.now();

	beforeEach(() => {
		cy.login('v.o.hrytsenko@student.khai.edu', '123123');
		cy.visit('/en/brands/74');
	});

	it ('TS11-5: Адміністратор змінює дані бренда автомобіля', () => {
		cy.get('input[name="brandName"]').clear().type(newBrandName).should('have.value', newBrandName);

		cy.get('.dropdown-country button').click();
		cy.contains('.dropdown-item', 'Germany').click();
		cy.get('.dropdown-country button').should('contain.text', 'Germany');

		cy.get('input[type="file"]').selectFile('cypress/fixtures/update-test-brand.jpg', { force: true });
		cy.get('.file-name').should('not.contain', 'File not selected');

		cy.intercept('PUT', '**/brands/*').as('updateBrand');

		cy.get('button[type="submit"]').should('not.be.disabled').click();

		// Перевірка відповіді від сервера
		cy.wait('@updateBrand').then((interception) => {
			expect(interception.response?.statusCode).to.eq(200);
			expect(interception.response?.body).to.have.property('id');
			expect(interception.response?.body.brand).to.eq(newBrandName);
		});

		cy.get('input[name="brandName"]').should('have.value', newBrandName);
		cy.get('.dropdown-country button').should('contain.text', 'Germany');
	});
});
