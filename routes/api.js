"use strict";
const Issue = require("../models/issue");

module.exports = function (app) {
  app
    .route("/api/issues/:project")

    .get(async function (req, res) {
      let project = req.params.project;
      const issues = await Issue.find();
      console.log(issues);
      res.header("Content-Type", "application/json");
      res.send(JSON.stringify(issues, null, 2));
    })

    .post(async function (req, res) {
      let project = req.params.project;
      //console.log(req.body);

      let issue = new Issue({
        issue_title: "",
        issue_text: req.body.issue_text,
        created_on: Date.now(),
        updated_on: Date.now(),
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to,
        open: true,
        status_text: req.body.status_text,
        project: project,
      });
      issue
        .save()
        .then((doc) => {
          console.log(`Create a new doc ${doc}`);
        })
        .catch((err) => {
          console.error(JSON.stringify(err));
          res.send({ error: "required field(s) missing" });
        });
    })

    .put(function (req, res) {
      let project = req.params.project;
    })

    .delete(function (req, res) {
      let project = req.params.project;
    });
};
