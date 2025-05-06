describe("Airstream Selector", () => {
  it("should display results when filters are applied", () => {
    cy.visit("http://localhost:3000");

    // Fill out the form
    cy.get("select").select("20");
    cy.get('input[placeholder="Enter max GVWR (lbs)"]').type("7000");
    cy.get('input[placeholder="Enter min number of sleepers"]').type("4");
    cy.get('input[placeholder="Enter max budget amount"]').type("50000");

    // Submit the form
    cy.contains("Find My Airstream").click();

    // Verify results
    cy.get(".result-card").should("exist");
  });
});