describe ('TS05-1 Сторінка профілю – Зміна даних користувача', () => {
	beforeEach(() => {
		cy.login('vbhrytsenko@gmail.com', '123123');
		cy.visit('/en/profile');
	});

	it ('Повинно змінити e-mail, імʼя, підписку та пароль', () => {
		cy.get('input[name="email"]')
			.clear()
			.type('v.o.hrytsenko@test.com');

		cy.get('input[name="fullName"]')
			.clear()
			.type('Владислав Гриценко');

		// Вводимо поточний пароль
		cy.get('input[placeholder="Enter current password"]').type('123123');

		// Вводимо новий пароль і повторюємо його
		cy.get('input[placeholder="Enter password"]').type('123123');
		cy.get('input[placeholder="Enter password repeat"]').type('123123');

		cy.contains('button', 'Save changes').click();

		// Перевіряємо наявність повідомлення про успішну зміну пароля або e-mail
		cy.contains('A confirmation email has been sent to').should('exist');
		cy.contains('User data has been successfully updated').should('exist');
	});
});

describe ('TS05-2 Сторінка профілю – Помилка при введенні невірного поточного пароля', () => {
	beforeEach(() => {
		cy.login('vbhrytsenko@gmail.com', '123123');
		cy.visit('/en/profile');
	});

	it ('Повинно показати помилку, якщо поточний пароль невірний', () => {
		// Переконуємося, що ми на сторінці профілю
		cy.get('input[name="email"]').should('exist');

		// Вводимо поточний пароль (невірний)
		cy.get('input[placeholder="Enter current password"]').type('invalid password');

		cy.get('input[placeholder="Enter password"]').type('123123');
		cy.get('input[placeholder="Enter password repeat"]').type('123123');

		cy.contains('button', 'Save changes').click();

		// Перевіряємо, що виводиться помилка про неправильний пароль
		cy.contains('You have entered an incorrect current password').should('exist');
	});
});

describe ('TS05-3 Сторінка профілю – Помилка при зміні e-mail на вже існуючий', () => {
	beforeEach(() => {
		cy.login('vbhrytsenko@gmail.com', '123123');
		cy.visit('/en/profile');
	});

	it ('Повинно показати помилку, якщо e-mail вже зареєстровано', () => {
		// Переконуємося, що ми на сторінці профілю
		cy.get('input[name="email"]').should('exist');

		// Вводимо вже існуючий e-mail
		cy.get('input[name="email"]').clear().type('v.o.hrytsenko@student.khai.edu');

		cy.contains('button', 'Save changes').click();

		// Перевіряємо, що виводиться помилка про вже існуючий e-mail
		cy.contains('Such an e-mail address is already in use').should('exist');
	});
});

describe ('TS05-4 Сторінка профілю – Налаштування розсилки новин', () => {
	beforeEach(() => {
		cy.login('vbhrytsenko@gmail.com', '123123');
		cy.visit('/en/profile');
	});

	it ('Повинно дозволити ввімкнути отримання новин на електронну адресу', () => {
		const checkbox = cy.contains('label', 'Receive e-mail newsletters')
			.parent()
			.find('input[type="checkbox"]');

		// Міняємо стан checkbox на протилежний
		checkbox.then($el => {
			if ($el.prop('checked')) {
				cy.wrap($el).uncheck({ force: true });
			} else {
				cy.wrap($el).check({ force: true });
			}
		});

		cy.contains('button', 'Save changes').click();

		cy.contains('User data has been successfully updated').should('exist');
	});
});
