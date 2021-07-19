context('Basic', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('page is ok', () => {
    cy.url()
      .should('eq', 'http://localhost:3000/')

    cy.get('#app')
  })
})
