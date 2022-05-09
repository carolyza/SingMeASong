const song = {
  name: "Rihanna - Umbrella",
  youtubeLink: `https://www.youtube.com/watch?v=CvBfHwUxHIk`,
};

describe("Add music to page and vote recommendation", () => {
  it("should add a music to the home page", () => {
    cy.resetDatabase();
    cy.createRecommendation();
    cy.contains(song.name);
    cy.contains("0");

    cy.end();
  });

  it("should increase the vote count", () => {
    cy.get("article svg:first").click();
    cy.contains("1");

    cy.end();
  });

  it("should decrease the vote count", () => {
    cy.get("article svg:last").click();
    cy.contains("0");

    cy.end();
  });
});
