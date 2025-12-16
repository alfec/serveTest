export const validateProductList = () =>{
    cy.get("h1").should('be.visible').and('have.text', "Em construção aguarde");
}
