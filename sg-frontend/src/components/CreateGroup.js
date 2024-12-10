import React, { useState } from "react";
import classes from "../css/Login.module.css";
import { Container, Button } from "reactstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function CreateGroup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    groupName: "",
    description: "",
    meetType: "offline",
    date: "",
    time: "",
    location: "",
    locationDescription: "",
    friendsSearch: "", // Added state for friends search
  });

  // Get the current date and time for validation
  const currentDate = new Date();
  const localDate = new Date(
    currentDate.getTime() - currentDate.getTimezoneOffset() * 60000
  );
  const formattedDate = localDate.toISOString().split("T")[0]; // Local date in YYYY-MM-DD format
  const currentTime = new Date()
    .toTimeString()
    .split(" ")[0]
    .substring(0, 5); // Current time in HH:MM format

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        groupName: formData.groupName,
        subject: formData.subject,
        date: formData.date,
        time: formData.time,
        location: formData.location,
        groupDescription: formData.description,
        friends: [], // You might want to update this based on selected friends
        type: formData.meetType,
        clientId: sessionStorage.getItem("clientId"),
      };
      const response = await axios.post(
        "http://localhost:3010/api/auth/createGroup",
        payload
      );

      const chatResponse = await axios.post(
        "http://localhost:3010/chat/createChat",
        {
          id: response.data.groupId,
          isGroup: true,
        }
      );

      if (
        response.data.status === "success" &&
        chatResponse.data.status === "success"
      ) {
        navigate("/dashboard"); // Navigate to the dashboard
      } else {
        console.log("Group Creation failed: ", response.data.message);
      }
    } catch (error) {
      console.error("Group Creation failed:", error.message);
    }
  };

  return (
    <Container>
      <div className={`${classes.authFormContainer} pt-5`}>
        <form
          className={`${classes.newEventContainer}`}
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
                    name="groupName"
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
                    min={formattedDate} // Prevent past dates using the local date
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
                    min={currentTime} // Prevent past times
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

            {/* Row 3: Group Description */}
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

            {/* Row 4: Meeting Type and Add Your Friends */}
            <div className="row mt-3">
              {/* Meeting Type Section */}
              <div className="col-md-6">
                <label>Meeting Type</label>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="meetType"
                    value="online"
                    checked={formData.meetType === "online"}
                    onChange={handleChange}
                  />
                  <label className="form-check-label">Online</label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="meetType"
                    value="offline"
                    checked={formData.meetType === "offline"}
                    onChange={handleChange}
                  />
                  <label className="form-check-label">Offline</label>
                </div>
              </div>

              {/* Add Your Friends Section */}
              <div className="col-md-6">
                <label>Add your friends</label>
                <input
                  type="text"
                  className="form-control mt-2"
                  name="friendsSearch"
                  value={formData.friendsSearch}
                  onChange={handleChange}
                  placeholder="Search friends..."
                  style={{ maxWidth: "100%", height: "38px" }} // Customize size as needed
                />
                {/* You can add additional functionality here, such as displaying search results */}
              </div>
            </div>

            {/* Row 5: Location Description */}
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
            <div
              className="row mt-4"
              style={{ justifyContent: "right", alignItems: "center" }}
            >
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
                onClick={(e) => handleCreateGroup(e)}
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
