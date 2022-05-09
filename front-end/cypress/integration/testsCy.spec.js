describe("Page top", () => {
  it("should go to page top when clicked", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Top").click();
    cy.url().should("eq", "http://localhost:3000/top");

    cy.end();
  });
});

describe("Page random", () => {
  it("should go to random when clicked", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Random").click();
    cy.url().should("eq", "http://localhost:3000/random");

    cy.end();
  });
});

describe("Order of recommendations", () => {
  it("should be in descending order of upvotes", () => {
    cy.resetDatabase();
    cy.seedDatabase();

    cy.get("article:first div:last").should("have.text", "10");
    cy.get("article:last div:last").should("have.text", "0");

    cy.end();
  });
});
