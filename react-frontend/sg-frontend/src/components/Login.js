import React, { useState } from "react";
import classes from "../css/Login.module.css";
import { Container } from "reactstrap";

export default function (props) {
    const [currMode, setCurrMode] = useState('Login');
    const [loginForm, setLoginForm] = useState({
        email: '',
        password: '',
    });

    const [signUpForm, setSignUpForm] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        courseOfStudy: '',
        yearOfStudy: '',
        typeOfDegree: '',
        gender: '',
        profilePicture: null
    });

    // Login template JSX
    const logInTemplate = (
        <div className={classes.authFormContainer}>
            <form className={classes.authForm}>
                <div className={classes.authFormContent}>
                    <h3 className={classes.authFormTitle}>Log In</h3>
                    <div className="form-group mt-3">
                        <label>Email address</label>
                        <input
                            type="email"
                            className="form-control mt-1"
                            placeholder="Enter email"
                            value={loginForm.email}
                            onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                        />
                    </div>
                    <div className="form-group mt-3">
                        <label>Password</label>
                        <input
                            type="password"
                            className="form-control mt-1"
                            placeholder="Enter password"
                            value={loginForm.password}
                            onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        />
                    </div>
                    <div className="d-grid gap-2 mt-5">
                        <button type="submit" className={`btn btn-primary ${classes.btnColor}`}>
                            Submit
                        </button>
                    </div>
                    <p className="forgot-password text-right mt-3">
                        New here? <a href="#" onClick={() => setCurrMode('SignUp')}>Signup</a> now !!
                    </p>
                </div>
            </form>
            <div className={classes.sideContainer}>
                <div className={classes.sideContent}>
                    <h3>Welcome to Study Group Manager</h3>
                    <div>
                        <p>Connect with peers sharing the same interests.</p>
                        <p>Schedule group meetings seamlessly.</p>
                        <p>Collaborate effectively with real-time chat.</p>
                    </div>
                </div>
            </div>
        </div>
    );

    // Signup template JSX
    const signUpTemplate = (
        <div className={classes.signUpWrapper}>
            <div className={classes.topContainer}>
                <div className={classes.topContent}>
                    <h3>Sign Up</h3>
                </div>
            </div>
        <div className={classes.authFormContainer}>
            <form className={classes.signUpForm}>
                <div className={classes.topFormContent}>
                    {/* First row: Name fields */}
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group mt-3">
                                <label>First Name</label>
                                <input
                                    type="text"
                                    className="form-control mt-1"
                                    placeholder="Enter first name"
                                    value={signUpForm.firstName}
                                    onChange={(e) => setSignUpForm({ ...signUpForm, firstName: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group mt-3">
                                <label>Last Name</label>
                                <input
                                    type="text"
                                    className="form-control mt-1"
                                    placeholder="Enter last name"
                                    value={signUpForm.lastName}
                                    onChange={(e) => setSignUpForm({ ...signUpForm, lastName: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Second row: Email, Password fields */}
                    <div className="row">
                        <div className="col-md-4">
                            <div className="form-group mt-3">
                                <label>Email address</label>
                                <input
                                    type="email"
                                    className="form-control mt-1"
                                    placeholder="Enter email"
                                    value={signUpForm.email}
                                    onChange={(e) => setSignUpForm({ ...signUpForm, email: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group mt-3">
                                <label>Password</label>
                                <input
                                    type="password"
                                    className="form-control mt-1"
                                    placeholder="Enter password"
                                    value={signUpForm.password}
                                    onChange={(e) => setSignUpForm({ ...signUpForm, password: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group mt-3">
                                <label>Confirm Password</label>
                                <input
                                    type="password"
                                    className="form-control mt-1"
                                    placeholder="Confirm password"
                                    value={signUpForm.confirmPassword}
                                    onChange={(e) => setSignUpForm({ ...signUpForm, confirmPassword: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Third row: Additional info */}
                    <div className="row">
                        <div className="col-md-3">
                            <div className="form-group mt-3">
                                <label>Course of Study</label>
                                <input
                                    type="text"
                                    className="form-control mt-1"
                                    placeholder="Enter course of study"
                                    value={signUpForm.courseOfStudy}
                                    onChange={(e) => setSignUpForm({ ...signUpForm, courseOfStudy: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="form-group mt-3">
                                <label>Year of Study</label>
                                <input
                                    type="text"
                                    className="form-control mt-1"
                                    placeholder="Enter year of study"
                                    value={signUpForm.yearOfStudy}
                                    onChange={(e) => setSignUpForm({ ...signUpForm, yearOfStudy: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="form-group mt-3">
                                <label>Type of Degree</label>
                                <input
                                    type="text"
                                    className="form-control mt-1"
                                    placeholder="Enter degree type"
                                    value={signUpForm.typeOfDegree}
                                    onChange={(e) => setSignUpForm({ ...signUpForm, typeOfDegree: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="form-group mt-3">
                                <label>Gender</label>
                                <select
                                    className="form-control mt-1"
                                    value={signUpForm.gender}
                                    onChange={(e) => setSignUpForm({ ...signUpForm, gender: e.target.value })}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="d-grid gap-2 mt-5">
                        <button type="submit" className={`btn btn-primary ${classes.btnColor}`}>
                            Submit
                        </button>
                    </div>
                    <p className="forgot-password text-right mt-3">
                        Already have an account? <a href="#" onClick={() => setCurrMode('Login')}>Login</a> now !!
                    </p>
                </div>
            </form>
        </div>
        </div>
    );

    // Function to render either the login or sign-up form based on currMode
    function formContent() {
        if (currMode === "Login") {
            return logInTemplate;
        } else {
            return signUpTemplate;
        }
    }

    return (
        <Container>
            {formContent()}
        </Container>
    );
}
