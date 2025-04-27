describe ('TS06-1 Сторінка профілю – Вихід з системи', () => {
	beforeEach(() => {
		cy.login('vbhrytsenko@gmail.com', '123123');
		cy.visit('/en/profile');
	});

	it ('Повинен вийти з системи та перейти на сторінку входу', () => {
		// Перевіряємо, що ми на сторінці профілю
		cy.get('input[name="email"]').should('exist');

		// Якщо є бургер-кнопка — відкриваємо меню:
		cy.get('body').then($body => {
			if ($body.find('#menu-button').length) {
				cy.get('#menu-button').click();
			}
		});

		// Тиснемо Logout
		cy.contains('a.nav-link', 'Logout').click({ force: true });

		// Перевіряємо, що відбулося перенаправлення на сторінку входу
		cy.url().should('include', '/en/login');
		cy.contains('button', 'Login').should('exist');
	});
});
