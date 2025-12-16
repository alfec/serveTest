const nameField = "[data-testid='nome']";
const emailField = "[data-testid='email']";
const passwordField = "[data-testid='password']";
const checkBoxAdm = "[data-testid='checkbox']";
const btnRegister = "[data-testid='cadastrar']";
const mandatoryName = "div:nth-of-type(1) > span";
const mandatoryEmail = "div:nth-of-type(2) > span";
const mandatoryPassword = "div:nth-of-type(3) > span";
const duplicatedEmail = "div.alert > span";
const successAlert = "div > form > div:nth-child(3) > div";

export const createUser = (name, email, password)=>{
    cy.get(nameField).type(name)
    cy.get(emailField).type(email);
    cy.get(passwordField).type(password);
    //cy.get(checkBoxAdm).click();
    cy.get(btnRegister).click();
    validateElement('successAlert');
}

function validateElement(element){
    const elementMap = {
        'mandatoryName': mandatoryName,
        'mandatoryEmail': mandatoryEmail,
        'mandatoryPassword': mandatoryPassword,
        'duplicatedEmail': duplicatedEmail,
        'successAlert': successAlert,
    }
    const validate = elementMap[element]
    cy.get(validate, {timeout: 3000}).should('be.visible');
}
export { validateElement }

const x = Math.floor(Math.random() * 10000);

export const createEmail = () => {
    const email = "test"+x+"@teste.com";
    return email;
}

export const createSameUser = (name, email, password) => {
    //function to create the same user again and see the error message
    cy.get(nameField).type(name);
    cy.get(emailField).type(email);
    cy.get(passwordField).type(password);
    cy.get(btnRegister).click();
    validateElement('duplicatedEmail');
}
