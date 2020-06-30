const CourseCandidate = require("../models/CourseCandidate");
const aqp = require("api-query-params");

exports.FetchCourseCandidate = (req, res) => {
  const { filter, skip, limit, sort, projection } = aqp(req.query);
  CourseCandidate.find(filter)
  .sort(sort)
    .skip(skip)
    .limit(limit)
    
    .select(projection)
    .populate("User")
    .then(result => {
      if (result.length < 1) {
        return res.status(404).send({ message: "No CourseCandidatees Found" });
      } else {
        return res
          .status(200)
          .send({ message: "CourseCandidatees Listing", ServerResponse: result });
      }
    })
    .catch(error => {
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.CreateCourseCandidate = (req, res) => {
  const courseCandidate = new CourseCandidate(req.body);
  courseCandidate
    .save()
    .then(result => {
      return res
        .status(201)
        .send({ Message: "CourseCandidate Created", id: result._id });
    })
    .catch(error => {
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.UpdateCourseCandidate = (req, res) => {
  CourseCandidate.updateOne({ Candidate: req.body.Candidate,CourseId:req.body.CourseId}, req.body,{upsert: true})
    .then(result => {
      return res.status(200).send({ message: "CourseCandidate Updated" });
    })
    .catch(error => {
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.DeleteCourseCandidate = (req, res) => {
  CourseCandidate.deleteOne({ _id: req.params.Id })
    .then(result => {
      return res.status(200).send({ message: "CourseCandidate Deleted" });
    })
    .catch(error => {
      return res.status(500).send({ ErrorOccured: error });
    });
};
