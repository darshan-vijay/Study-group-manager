import React, { useState } from 'react';
import { Button, Form, FormGroup, Label, Input, Container } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
function Signup({ onLoginSuccess }) {
    const [formData, setFormData] = useState({
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
    const navigate = useNavigate(); 
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "profilePicture") {
            setFormData({...formData, profilePicture: e.target.files[0]});
        } else {
            setFormData({...formData, [name]: value});
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords don't match!");
            return;
        }
        console.log('Signup data:', formData);
        // Implement signup logic here
        onLoginSuccess(); 
        navigate('/dashboard'); 
    };

    return (
        <Container>
            <h2>Sign Up</h2>
            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label for="firstName">First Name</Label>
                    <Input type="text" name="firstName" id="firstName" placeholder="Enter first name" value={formData.firstName} onChange={handleChange} />
                </FormGroup>
                <FormGroup>
                    <Label for="lastName">Last Name</Label>
                    <Input type="text" name="lastName" id="lastName" placeholder="Enter last name" value={formData.lastName} onChange={handleChange} />
                </FormGroup>
                <FormGroup>
                    <Label for="email">Email</Label>
                    <Input type="email" name="email" id="email" placeholder="Enter email" value={formData.email} onChange={handleChange} />
                </FormGroup>
                <FormGroup>
                    <Label for="password">Password</Label>
                    <Input type="password" name="password" id="password" placeholder="Password" value={formData.password} onChange={handleChange} />
                </FormGroup>
                <FormGroup>
                    <Label for="confirmPassword">Confirm Password</Label>
                    <Input type="password" name="confirmPassword" id="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} />
                </FormGroup>
                <FormGroup>
                    <Label for="courseOfStudy">Course of Study</Label>
                    <Input type="select" name="courseOfStudy" id="courseOfStudy" value={formData.courseOfStudy} onChange={handleChange}>
                        <option value="" disabled selected>Select your course</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="Business">Business</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Psychology">Psychology</option>
                    </Input>
                </FormGroup>
                <FormGroup>
                    <Label for="yearOfStudy">Year of Study</Label>
                    <Input type="select" name="yearOfStudy" id="yearOfStudy" value={formData.yearOfStudy} onChange={handleChange}>
                        <option value="" disabled selected>Select your year</option>
                        <option value="Freshman">Freshman</option>
                        <option value="Sophomore">Sophomore</option>
                        <option value="Junior">Junior</option>
                        <option value="Senior">Senior</option>
                        <option value="Graduate">Graduate</option>
                    </Input>
                </FormGroup>
                <FormGroup>
                    <Label for="typeOfDegree">Type of Degree</Label>
                    <Input type="select" name="typeOfDegree" id="typeOfDegree" value={formData.typeOfDegree} onChange={handleChange}>
                        <option value="" disabled selected>Select degree type</option>
                        <option value="Bachelor's">Bachelor's</option>
                        <option value="Master's">Master's</option>
                        <option value="PhD">PhD</option>
                    </Input>
                </FormGroup>
                <FormGroup>
                    <Label for="gender">Gender</Label>
                    <Input type="select" name="gender" id="gender" value={formData.gender} onChange={handleChange}>
                        <option value="" disabled selected>Select your gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </Input>
                </FormGroup>
                <FormGroup>
                    <Label for="profilePicture">Profile Picture</Label>
                    <Input type="file" name="profilePicture" id="profilePicture" onChange={handleChange} />
                </FormGroup>
                <Button type="submit" color="primary">Sign Up</Button>
            </Form>
        </Container>
    );
}

export default Signup;
