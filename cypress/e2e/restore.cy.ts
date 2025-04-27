describe ('TS03-1: Відновлення пароля – підтверджений користувач', () => {
	it ('Повинен відправити повідомлення на електронну адресу', () => {
		cy.visit('/en/restore');

		cy.get('input[name="email"]').type('vbhrytsenko@gmail.com');

		cy.get('button[type="submit"]')
			.should('be.enabled')
			.should('be.visible')
			.click();

		cy.contains('A recovery message has been sent to your email', { timeout: 5000 })
			.should('be.visible');
	});
});

describe ('TS03-2: Відновлення пароля – електронну адресу не підтверджено', () => {
	it ('Повинен показати помилку, якщо e-mail не підтверджено', () => {
		cy.visit('/en/restore');

		cy.get('input[name="email"]').type('unconfirmed@gmail.com');

		cy.get('button[type="submit"]')
			.should('be.enabled')
			.should('be.visible')
			.click();

		cy.contains('Your email has not been verified', { timeout: 5000 })
			.should('be.visible');
	});
});

describe ('TS03-3: Відновлення пароля – електронну адресу не зареєстровано', () => {
	it ('Повинен показати помилку, якщо e-mail не зареєстровано', () => {
		cy.visit('/en/restore');

		cy.get('input[name="email"]').type('unregistered@gmail.com');

		cy.get('button[type="submit"]')
			.should('be.enabled')
			.should('be.visible')
			.click();

		cy.contains('This email is not registered', { timeout: 5000 })
			.should('be.visible');
	});
});

describe ('TS04-1: Відновлення пароля – коректний ключ', () => {
	it ('Повинен успішно змінити пароль при правильному ключі', () => {
		cy.visit('/en/restore/ZHMCWqhEPh0Zve7h');

		cy.get('input[placeholder="Password"]').type('123123');
		cy.get('input[placeholder="Password repeat"]').type('123123');

		cy.get('button[type="submit"]').should('be.enabled').click();

		// Перевіряємо повідомлення про успішну зміну пароля
		cy.contains('Your password has been successfully changed', { timeout: 5000 })
			.should('be.visible');
	});
});

describe ('TS04-2: Відновлення пароля – некоректний ключ', () => {
	it ('Повинен показати помилку при неправильному ключі', () => {
		cy.visit('/en/restore/incorrectKey');

		// Перевіряємо повідомлення про помилку
		cy.contains('Key is invalid', { timeout: 5000 }).should('be.visible');
	});
});
