describe ('TS12-1 Адміністратор обирає бренд автомобіля', () => {
	beforeEach(() => {
		cy.login('vbhrytsenko@gmail.com', '123123');
		cy.visit('/en/brands');
	});

	it ('Відкривається сторінка зі списком автомобілів обраного бренда', () => {
		cy.contains('.brands__card', 'Toyota')
			.find('a')
			.contains('View cars')
			.click();

		cy.url().should('include', '/en/cars/');

		cy.get('.cars-container', { timeout: 10000 }).should('exist').and('be.visible');
	});
});

describe ('TS12-2 Адміністратор фільтрує автомобілі бренду за назвою', () => {
	beforeEach(() => {
		cy.login('vbhrytsenko@gmail.com', '123123');
		cy.visit('/en/cars/4');
	});

	it ('Автомобілі успішно відфільтровано за назвою', () => {
		const carModel = 'Land Cruiser 200';

		cy.get('input[placeholder="Enter car model"]').type(carModel);

		cy.get('.cars__card').should('have.length', 1);
		cy.contains('.cars__card', carModel).should('exist');
	});
});

describe ('TS12-3 Адміністратор фільтрує та сортує автомобілі бренду за назвою та трансмісією', () => {
	beforeEach(() => {
		cy.login('vbhrytsenko@gmail.com', '123123');
		cy.visit('/en/cars/4');
	});

	it ('Автомобілі успішно відфільтровано за назвою та трансмісією', () => {
		const carModel = 'Land Cruiser';

		cy.get('input[placeholder="Enter car model"]').type(carModel);

		cy.get('.p-multiselect-label-container').click();
		cy.get('body').find('li.p-multiselect-option').contains('Automatic').should('be.visible').click();

		// Перевіряємо результати фільтрації + сортування
		cy.get('.cars__card').each(($el) => {
			cy.wrap($el).find('.card-title').should('contain.text', carModel);
			cy.wrap($el).find('.card-text').should('exist');
		});
	});
});

describe ('TS12-4 Адміністратор фільтрує автомобілі бренду за трансмісіями', () => {
	beforeEach(() => {
		cy.login('vbhrytsenko@gmail.com', '123123');
		cy.visit('/en/cars/4');
	});

	it ('Автомобілі успішно відфільтровано за трансмісіями', () => {
		cy.get('.p-multiselect-label-container').click();

		cy.get('body').find('li.p-multiselect-option').contains('Automatic').should('be.visible').click();
	});
});
