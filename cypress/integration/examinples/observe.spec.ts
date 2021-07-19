context('Basic', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.url()
      .should('eq', 'http://localhost:3000/')
  })
  it('scroll is ok', () => {
    cy.get('[id="is-visible"]').should('not.be.checked')
    cy.get('.test').scrollIntoView()
    cy.get('[id="is-visible"]').should('be.checked')
    cy.get('.info').scrollIntoView()
    cy.get('[id="is-visible"]').should('not.be.checked')
  })

  it('toggle is ok', () => {
    cy.get('.test').scrollIntoView()
    cy.get('[id="is-visible"]').should('be.checked')
    cy.get('.toggle').click()
    cy.get('.test').should('not.be.visible')
    cy.get('[id="is-visible"]').should('not.be.checked')
    cy.get('.toggle').click()
    cy.get('.test').should('be.visible')
    cy.get('[id="is-visible"]').should('be.checked')
  })
})
