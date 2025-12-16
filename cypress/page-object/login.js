const emailField = "[data-testid='email']";
const passwordField = "[data-testid='senha']";
const btnLogin = "[data-testid='entrar']";
const btnRegister = "[data-testid='cadastrar']";

export const doLogin = (email, password)=>{
    cy.get(emailField).type(email);
    cy.get(passwordField).type(password);
    cy.get(btnLogin).click();
}

export const clickRegister = () =>{
    cy.get(btnRegister).click();
}

export const wrongLogin = (email, password) => {
    cy.get(emailField).clear().type(email);
    cy.get(passwordField).clear().type(password);
    cy.get(btnLogin).click();
    cy.get("div.alert > span", {timeout: 3000}).should('be.visible');
}
