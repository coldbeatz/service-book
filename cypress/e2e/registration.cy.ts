describe ('TS01-1: Реєстрація нового користувача', () => {

	it ('Повинна дозволити зареєструвати нового користувача та показати повідомлення про відправку листа', () => {
		cy.visit('/en/registration');

		const randomEmail = `test_${Date.now()}@example.com`;

		cy.get('input[formcontrolname="email"]').type(randomEmail);
		cy.get('input[formcontrolname="fullName"]').type('Test User');
		cy.get('password-input-root').eq(0).find('input').type('123123');
		cy.get('password-input-root').eq(1).find('input').type('123123');

		cy.get('button[type="submit"]')
			.should('be.enabled')
			.should('be.visible')
			.click();

		// Дочекатися появи повідомлення перед читанням тексту
		cy.contains('Success! Confirm your email address', { timeout: 10000 })
			.should('be.visible');
	});
});

describe ('TS01-2: Реєстрація з некоректними даними', () => {
	it ('Повинна показати помилки валідації при неправильному вводі', () => {
		cy.visit('/en/registration');

		cy.get('input[formcontrolname="email"]').type('abcd');
		cy.get('input[formcontrolname="fullName"]').type('Test User');
		cy.get('password-input-root').eq(0).find('input').type('123123');
		cy.get('password-input-root').eq(1).find('input').type('123123');

		cy.get('button[type="submit"]')
			.should('be.enabled')
			.should('be.visible')
			.click();

		cy.contains('You entered an incorrect e-mail').should('be.visible');
	});
});

describe ('TS01-3: Реєстрація з вже існуючим email', () => {
	it ('Повинна показати помилку, що e-mail вже зареєстровано', () => {
		cy.visit('/en/registration');

		const existingEmail = 'vbhrytsenko@gmail.com';

		cy.get('input[formcontrolname="email"]').type(existingEmail);
		cy.get('input[formcontrolname="fullName"]').type('Test User');
		cy.get('password-input-root').eq(0).find('input').type('123123');
		cy.get('password-input-root').eq(1).find('input').type('123123');

		cy.get('button[type="submit"]')
			.should('be.enabled')
			.should('be.visible')
			.click();

		cy.contains('E-mail is already registered').should('be.visible');
	});
});
