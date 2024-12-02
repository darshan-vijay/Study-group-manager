import React, { useState } from "react";
import classes from "../css/Login.module.css";
import { Container, Button } from "reactstrap";
import { useNavigate } from "react-router-dom";

export default function CreateGroup() {
  const navigate = new useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    groupName: "",
    description: "",
    visibility: "public",
    date: "",
    time: "",
    location: "",
    locationDescription: "",
  });
  const submitGroup = (e) => {};
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
  };

  return (
    <Container>
      <div className={`${classes.authFormContainer} pt-5`}>
        <form
          className={`${classes.newEventContainer}`}
          onSubmit={handleSubmit}
          style={{
            color: "white",
            padding: "2rem",
            borderRadius: "8px",
          }}
        >
          <div className={`${classes.newEventContent} p-5`}>
            <h3 className={classes.authFormTitle}>New Group</h3>

            {/* Row 1: Title, Subject, Description */}
            <div className="row mt-3">
              <div className="col-md-4">
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter Title"
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label>Subject</label>
                  <input
                    type="text"
                    className="form-control"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Enter Subject"
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label>Group Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="subject"
                    value={formData.groupName}
                    onChange={handleChange}
                    placeholder="Enter Group Name"
                  />
                </div>
              </div>
            </div>

            {/* Row 2: Date, Time, Location */}
            <div className="row mt-3">
              <div className="col-md-4">
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label>Time</label>
                  <input
                    type="time"
                    className="form-control"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    className="form-control"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Enter Location"
                  />
                </div>
              </div>
            </div>

            {/* Row 3: Desc*/}
            <div className="row mt-3">
              <div className="col-md-12">
                <div className="form-group">
                  <label>Group Description</label>
                  <textarea
                    className="form-control"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter Description, topics to be discussed..."
                  />
                </div>
              </div>
            </div>

            {/* Row 4: Post Visibility */}
            <div className="row mt-3">
              <div className="col-md-12">
                <label>Post Visibility</label>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="visibility"
                    value="public"
                    checked={formData.visibility === "public"}
                    onChange={handleChange}
                  />
                  <label className="form-check-label">Public</label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="visibility"
                    value="private"
                    checked={formData.visibility === "private"}
                    onChange={handleChange}
                  />
                  <label className="form-check-label">Private</label>
                </div>
              </div>
            </div>

            {/* Row 4: Location Description */}
            <div className="row mt-3">
              <div className="col-md-12">
                <div className="form-group">
                  <label>Location Description</label>
                  <textarea
                    className="form-control"
                    name="locationDescription"
                    value={formData.locationDescription}
                    onChange={handleChange}
                    placeholder="Provide more details about the location"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="row mt-4 " style={{ justifyContent: "right" }}>
              <Button
                className={`btn outline-dark col-3`}
                onClick={() => {
                  navigate("/dashboard");
                }}
              >
                Cancel
              </Button>
              <button
                type="submit"
                className={`btn btn-primary ms-3 ${classes.btnColor} col-3`}
                onClick={submitGroup()}
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </Container>
  );
}
