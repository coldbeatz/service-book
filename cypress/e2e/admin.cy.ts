describe('TS09-1 Доступ адміністратора до сторінок користувача', () => {
	beforeEach(() => {
		cy.login('v.o.hrytsenko@student.khai.edu', '123123');
	});

	it ('Адміністратор може відкрити сторінку налаштувань профілю', () => {
		cy.visit('/en/profile');

		cy.get('input#email').should('be.visible');
	});

	it ('Адміністратор може відкрити список своїх автомобілів', () => {
		cy.visit('/en/user-cars');

		cy.get('.card.user-car').should('exist');
	});
});
