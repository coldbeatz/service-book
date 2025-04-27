describe('TSN01 Перевірка заборони доступу для звичайного користувача (редірект на /en)', () => {
	beforeEach(() => {
		cy.login('test3@gmail.com', '123123');
	});

	const accessDeniedUrls = [
		{ url: '/en/cars/4/1', testId: '1' },
		{ url: '/en/cars/4/1/maintenance', testId: '2' },
		{ url: '/en/cars/4/1/engines', testId: '3' },
		{ url: '/en/alerts', testId: '4' },
		{ url: '/en/services', testId: '5' }
	];

	accessDeniedUrls.forEach(({ url, testId }) => {
		it (`TSN01-${testId} Звичайний користувач не має доступу до ${url}`, () => {
			cy.visit(url);
			cy.location('pathname').should('eq', '/en');
		});
	});

	it (`TSN01-6 Користувач не має доступу до нотаток чужого автомобіля`, () => {
		cy.visit('/en/user-cars/1/notes/1');
		cy.location('pathname').should('eq', '/en');
	});

	it (`TSN01-7 Користувач не має доступу до чужого автомобіля`, () => {
		cy.visit('/en/user-cars/1');
		cy.location('pathname').should('eq', '/en');
	});
});
