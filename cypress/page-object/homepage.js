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
    const choose = {
        'serverestLogo': serverestLogo,
        'buscador': searchBar,
        'productGrid': productGrid
    }[element]
    cy.get(choose).should('be.visible');
}
export { validateElement }

export const clickBtn = (button) =>{
    const btn ={
        'homeBtn': homeBtn,
        'buyListBtn': buyListBtn,
        'cartBtn': cartBtn,
        'logoutBtn': logoutBtn,
        'Search': searchBtn,
        'SearchBar': searchBar,
        'AddtoList': addToListBtn
    }[button]
    cy.get(btn).click()
}

export const searchProduct = (product) =>{
    clickBtn('searchBar').type(product);
    clickBtn('Search');
    cy.get(productGrid).should('be.visible')
}
