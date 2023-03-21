/// <reference types="cypress"/>
const body = require("../fixtures/userApi.json");
const updateBody = require("../fixtures/updateUserApi.json");

describe("API tests - Adding and updating a user", () => {
  afterEach(() => {
    cy.deleteUser(body.username);
  });

  it("Add new user", () => {
    cy.addUser(body)
      .then((response) => {
        //cy.log(JSON.stringify(response.body));
        expect(response.status).eq(200);
        expect(response.body.message).eq("12345");
      });
  });

  it("Get user", () => {
    cy.addUser(body);
    cy.getUser(body.username)
      .then((response) => {
        expect(response.status).eq(200);
        expect(response.body.id).eq(body.id);
        expect(response.body).to.have.property("username", body.username);
        expect(response.body).to.have.property("firstName", body.firstName);
        expect(response.body).to.have.property("lastName", body.lastName);
        expect(response.body).to.have.property("email", body.email);
        expect(response.body).to.have.property("password", body.password);
        expect(response.body).to.have.property("phone", body.phone);
        expect(response.body).to.have.property("userStatus", body.userStatus);
      });
  });

  it("Update user", () => {
    cy.addUser(body);
    cy.updateUser(body.username, updateBody)
      .then((response) => {
        //cy.log(JSON.stringify(response.body));
        expect(response.status).eq(200);
        expect(response.body.message).eq("1234567");
          cy.getUser(updateBody.username)
            .then((response) => {
              expect(response.status).eq(200);
              expect(response.body).to.have.property("username", updateBody.username);
              expect(response.body).to.have.property("firstName", updateBody.firstName);
              expect(response.body).to.have.property("lastName", updateBody.lastName);
              expect(response.body).to.have.property("email", updateBody.email);
              expect(response.body).to.have.property("password", updateBody.password);
              expect(response.body).to.have.property("phone", updateBody.phone);
              expect(response.body).to.have.property("userStatus", updateBody.userStatus);
            });
        });
  });
});

describe("API tests - Delete user and error handling", () => {
  it("Delete user", () => {
    cy.addUser(body);
    cy.deleteUser(body.username)
      .then((response) => {
        //cy.log(JSON.stringify(response.body));
        expect(response.status).eq(200);
        expect(response.body.message).eq(body.username);
      });
  });

  it("1 option - Error 404 of getting a user when the user was deleted", () => {
    cy.addUser(body);
    cy.deleteUser(body.username);
    cy.getUser(body.username)
      .then((response) => {
        expect(response.status).eq(404);
        expect(response.body.message).eq("User not found");
      });
  });

  it("2 option - Error 404 of getting a user when the user was deleted", () => {
    cy.addUser(body);
    cy.deleteUser(body.username)
      .then((response) => {
        expect(response.status).eq(200);
          cy.getUser(body.username)
            .then((response) => {
              expect(response.status).eq(404);
              expect(response.body.message).eq("User not found");
            });
      });
  });
});