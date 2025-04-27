describe ('TS02-1: Успішний вхід в систему', () => {
	it ('Повинен дозволити увійти користувачу з правильними логіном та паролем', () => {
		cy.visit('/en/login');

		cy.get('input[formcontrolname="email"]').type('vbhrytsenko@gmail.com');
		cy.get('password-input-root').find('input').type('123123');

		cy.get('button[type="submit"]')
			.should('be.enabled')
			.should('be.visible')
			.click();

		// Переконатись, що ми не на сторінці логіну
		cy.url().should('not.include', '/login');

		cy.get('.header__end .nav-link')
			.contains('Logout')
			.should('exist');
	});
});

describe ('TS02-2: Невірний логін або пароль', () => {
	it ('Повинен показати помилку, якщо логін або пароль невірні', () => {
		cy.visit('/en/login');

		cy.get('input[formcontrolname="email"]').type('unregistered@student.khai.edu');
		cy.get('password-input-root').find('input').type('incorrect');

		cy.get('button[type="submit"]')
			.should('be.enabled')
			.should('be.visible')
			.click();

		// Перевірка наявності повідомлення про помилку
		cy.contains('Incorrect login or password', { timeout: 5000 })
			.should('be.visible');
	});
});

describe ('TS02-3: Вхід з непідтвердженою електронною адресою', () => {
	it ('Повинен показати помилку, якщо електронну адресу не підтверджено', () => {
		cy.visit('/en/login');

		cy.get('input[formcontrolname="email"]').type('unconfirmed@gmail.com');
		cy.get('password-input-root').find('input').type('123123');

		cy.get('button[type="submit"]')
			.should('be.enabled')
			.should('be.visible')
			.click();

		// Перевірка наявності повідомлення про помилку
		cy.contains('Incorrect login or password', { timeout: 5000 })
			.should('be.visible');
	});
});

