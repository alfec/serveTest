const homeBtn = "[data-testid='home']";
const buyListBtn = "[data-testid='lista-de-compras']";
const cartBtn = "[data-testid='carrinho']";
const logoutBtn = "[data-testid='logout']";
const searchBar = "[data-testid='pesquisar']";
const searchBtn = "[data-testid='botaoPesquisar']";
const addToListBtn = "[data-testid='adicionarNaLista']";
const productGrid = "#root > div > div > div.container-fluid > div > section";
const serverestLogo = "h1";

function validateElement(element){
    const elementsMap = {
        'serverestLogo': serverestLogo,
        'searchBar': searchBar,
        'productGrid': productGrid
    }
    const chooseElement = elementsMap[element];
    cy.get(chooseElement, {timeout: 10000}).should('be.visible');
}
export { validateElement }

export const clickBtn = (button) =>{
    const btnMap ={
        'homeBtn': homeBtn,
        'buyListBtn': buyListBtn,
        'cartBtn': cartBtn,
        'logoutBtn': logoutBtn,
        'Search': searchBtn,
        'SearchBar': searchBar,
        'AddtoList': addToListBtn
    }
    const btn = btnMap[button]
    cy.get(btn, {timeout: 10000}).click()
}

export const searchProduct = (product) =>{
    cy.get(searchBar, {timeout: 10000}).should('be.visible');
    cy.get('[data-testid="pesquisar"]').click().type(product);
    clickBtn('Search');
    cy.get(productGrid, {timeout: 10000}).should('be.visible')
}

export const clickGridProduct = (index) =>{
    validateElement('productGrid');
    cy.get('[href="/minhaListaDeProdutos"] > [data-testid="adicionarNaLista"]').eq(index).click();
}