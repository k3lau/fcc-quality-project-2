"use strict";
const Issue = require("../models/issue");

module.exports = function (app) {
  app
    .route("/api/issues/:project")

    .get(async function (req, res) {
      let project = req.params.project;
      let filter = {};
      filter[project] = project;
      for (let param in req.query) {
        if (req.query.hasOwnProperty(param)) {
          filter[param] = req.query[param];
        }
      }
      console.log(filter);
      try {
        const issues = await Issue.find(filter);
        console.log(`GET issue:
          ${issues}`);
        //res.header("Content-Type", "application/json");
        //res.send(JSON.stringify(issues, null, 2));
        res.json(issues);
      } catch (err) {
        res.status(400).json({ errorr: err.message });
      }
    })

    .post(async function (req, res) {
      let project = req.params.project;
      //console.log(req.body);

      let issue = new Issue({
        issue_title: req.body.issue_title,
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
          res.json(doc);
        })
        .catch((err) => {
          console.error(`Error with input:
          ${issue}
          ${JSON.stringify(err, null, 2)}`);
          if (err.name === "ValidationError") {
            res.send({ error: "required field(s) missing" });
          }
        });
    })

    .put(function (req, res) {
      let project = req.params.project;
    })

    .delete(function (req, res) {
      let project = req.params.project;
    });
};
