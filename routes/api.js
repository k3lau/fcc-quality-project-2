"use strict";
const Issue = require("../models/issue");
const mongoose = require("mongoose");

module.exports = function (app) {
  app
    .route("/api/issues/:project")

    .get(async function (req, res) {
      let project = req.params.project;
      let filter = {};
      filter["project"] = project;
      for (let param in req.query) {
        if (req.query.hasOwnProperty(param)) {
          filter[param] = req.query[param];
        }
      }
      console.log(filter);
      try {
        const issues = await Issue.find(filter);
        //console.log(`GET issue:
        //  ${issues}`);
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
        created_by: req.body.created_by || "",
        assigned_to: req.body.assigned_to || "",
        open: true,
        status_text: req.body.status_text || "",
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

    .put(async function (req, res) {
      let project = req.params.project;
      const reqIssue = req.body;
      //console.log(req.body);
      //Error handling for request not an object
      if (
        !(
          typeof reqIssue === "object" &&
          reqIssue !== null &&
          !Array.isArray(reqIssue)
        )
      ) {
        return res.json({ error: "could not update" });
      }

      //Error handling for no _id property in request
      if (!reqIssue.hasOwnProperty("_id")) {
        return res.json({ error: "missing _id" });
      }

      //Error handling for wrong _id type
      if (!mongoose.Types.ObjectId.isValid(reqIssue._id)) {
        return res.json({ error: "could not update", _id: reqIssue._id });
      }

      try {
        //let issue = await Issue.findOne(reqIssue._id);
        //console.log(`GET issue:
        //    ${issues}`);
        let editField = {};
        const filter = { _id: reqIssue._id };

        //console.log(`What ${JSON.stringify(reqIssue)}`);

        for (let param in reqIssue) {
          if (reqIssue.hasOwnProperty(param) && param !== "_id") {
            editField[param] = reqIssue[param];
          }
        }

        if (JSON.stringify(editField) === "{}") {
          return res.json({
            error: "no update field(s) sent",
            _id: reqIssue._id,
          });
        }

        //console.log(`PUT issue:
        //  ${JSON.stringify(editField)} and ${filter}`);

        let doc = await Issue.findOneAndUpdate(filter, editField, {
          new: true,
        });

        //console.log(`RESULT doc:
        //${doc}`);

        if (!doc.get("_id")) {
          return res.json({ error: "could not update", _id: reqIssue._id });
        }
        return res.json({ result: "successfully updated", _id: reqIssue._id });
      } catch (err) {
        console.log(err);
        return res.json({ error: "could not update" });
      }
    })

    .delete(async function (req, res) {
      let project = req.params.project;
      if (!req.body.hasOwnProperty("_id")) {
        return res.json({ error: "missing _id" });
      }
      try {
        let issue = await Issue.deleteOne({ _id: req.body._id });
        console.log(issue);
        if (issue.deletedCount === 1) {
          return res.json({
            result: "successfully deleted",
            _id: req.body._id,
          });
        } else {
          return res.json({
            error: "could not delete",
            _id: req.body._id,
          });
        }
      } catch (err) {
        console.log(err);
        return res.json({ error: "could not delete", _id: req.body._id });
      }
    });
};
