/// <reference path="./commands.d.ts" />

Cypress.Commands.add('login', (email: string, password: string) => {
	cy.request({
		method: 'POST',
		url: 'http://localhost:8081/user/login',
		body: { email, password },
	}).then((response) => {
		window.sessionStorage.setItem('email', response.body.email);
		window.sessionStorage.setItem('token', response.body.token);
	});
});
