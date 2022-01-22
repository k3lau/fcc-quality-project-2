const chaiHttp = require("chai-http");
const assert = require("chai").assert;
const Issue = require("../models/issue");
const server = require("../server");
const chai = require("chai");

chai.use(chaiHttp);

suite("Functional Test ", function () {
  suite("Create issue", function () {
    test("Create an issue with every field", function (done) {
      const issue_title = "test # 1 issue title";
      const issue_text = "test # 1 issue text";
      const created_by = "test # 1 create by";
      const assigned_to = "test # 1 assigned to";
      const status_text = "test # 1 status text";
      const project = "apitest";
      const issue = {
        issue_title: issue_title,
        issue_text: issue_text,
        created_by: created_by,
        assigned_to: assigned_to,
        status_text: status_text,
        project: project,
      };
      chai
        .request(server)
        .post(`/api/issues/${project}`)
        .send(issue)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.issue_title, issue_title);
          assert.equal(res.body.issue_text, issue_text);
          assert.equal(res.body.assigned_to, assigned_to);
          assert.equal(res.body.created_by, created_by);
          assert.equal(res.body.open, open);
          assert.equal(res.body.status_text, status_text);
          assert.equal(res.body.project, project);
        });
      done();
    });
    test("Create an issue with only required field", function (done) {
      const issue_title = "test # 1 issue title";
      const issue_text = "test # 1 issue text";
      const created_by = "test # 1 create by";
      const project = "apitest";
      const issue = {
        issue_title: issue_title,
        issue_text: issue_text,
        created_by: created_by,
      };
      chai
        .request(server)
        .post(`/api/issues/${project}`)
        .send(issue)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.issue_title, issue_title);
          assert.equal(res.body.issue_text, issue_text);
          assert.equal(res.body.created_by, created_by);
          assert.equal(res.body.assigned_to, "");
          assert.equal(res.body.open, true);
          assert.equal(res.body.status_text, "");
          assert.equal(res.body.project, project);
        });
      done();
    });
    test("Create an issue with missing required field", function (done) {
      const issue_text = "test # 1 issue text";
      const created_by = "test # 1 create by";
      const project = "apitest";
      const issue = {
        issue_text: issue_text,
        created_by: created_by,
      };
      chai
        .request(server)
        .post(`/api/issues/${project}`)
        .send(issue)
        .end((err, res) => {
          assert.equal(res.status, 400);
          assert.deepEqual(res.body, { error: "required field(s) missing" });
        });
      done();
    });
  });
  suite("View issue", function () {
    test.skip("View issue on project", function (done) {
      const knownTest = {
        _id: "61ea53d417a44842be86edef",
        issue_title: "Yup",
        issue_text: "Test",
        created_on: "2022-01-21T06:33:56.040Z",
        updated_on: "2022-01-21T06:33:56.040Z",
        created_by: "Me",
        assigned_to: "",
        open: true,
        status_text: "",
        project: "apitest",
      };
      //console.log(`TEST ${knownTest.issue_title}`);
      const url = `/api/issues/${knownTest.project}?issue_title=${knownTest.issue_title}`;
      //console.log(url);
      chai
        .request(server)
        .get(url)
        .end((err, res) => {
          console.log(res.body);
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body[0].issue_title, knownTest.issue_title);
          assert.equal(res.body[0].issue_text, knownTest.issue_text);
          assert.equal(res.body[0].created_on, knownTest.created_on);
          assert.equal(res.body[0].created_by, knownTest.created_by);
          assert.equal(res.body[0].assigned_to, knownTest.assigned_to);
          assert.equal(res.body[0].open, knownTest.open);
          assert.equal(res.body[0].status_text, knownTest.status_text);
          assert.equal(res.body[0].project, knownTest.project);
        });
      done();
    });
  });
});
