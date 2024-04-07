describe('template spec', () => {
  it('login logout', () => {
    cy.visit('http://localhost:3000')
    cy.clearLocalStorage()
    cy.clearCookies()
    /* ==== Generated with Cypress Studio ==== */
    /* ==== Generated with Cypress Studio ==== */
    cy.get('#email').clear('test@test.ca');
    cy.get('#email').type('test@test.ca');
    cy.get('#password').clear('te');
    cy.get('#password').type('test123456');
    cy.get('.MuiButtonBase-root').click();
    cy.get('.css-1y942vo-MuiButtonBase-root-MuiButton-root').click();
    /* ==== End Cypress Studio ==== */
  })

  /* ==== Test Created with Cypress Studio ==== */
  it('beacons\'', function() {
    cy.visit('http://localhost:3000')
    cy.clearLocalStorage()
    cy.clearCookies()
    cy.get('#email').clear('test@test.ca');
    cy.get('#email').type('test@test.ca');
    cy.get('#password').clear('te');
    cy.get('#password').type('test123456');



    /* ==== Generated with Cypress Studio ==== */
    cy.get('.MuiButtonBase-root').click();
    cy.get('[href="map"]').click();
    cy.get('#\\:r1\\:').click();
    cy.get('#\\:r1\\:').click();
    cy.get('#\\:r1\\:').click();
    cy.get(':nth-child(2) > :nth-child(4)').click();
    cy.get('.css-yuob64 > :nth-child(2) > :nth-child(1)').click();
    cy.get('#name').clear('te');
    cy.get('#name').type('test beacon');
    cy.get('#x').click();
    cy.get('#x').click();
    cy.get('#x').click();
    cy.get('#y').click();
    cy.get('#y').click();
    cy.get('#y').click();
    cy.get('[type="submit"]').click();
    cy.get('.css-1y942vo-MuiButtonBase-root-MuiButton-root').click();
    /* ==== End Cypress Studio ==== */
  });
})