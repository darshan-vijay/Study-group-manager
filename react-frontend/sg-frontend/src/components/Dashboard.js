import React from 'react';
import Slider from 'react-slick';
import { Container, Button, Card, CardBody, CardTitle, CardText } from 'reactstrap';

function Dashboard() {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000
    };

    // Example data, replace with data fetched from your backend or Firebase
    const studyGroups = [
        { id: 1, subject: "Mathematics", description: "Join our group to explore advanced mathematics topics and prepare for exams." },
        { id: 2, subject: "Physics", description: "Weekly sessions to cover new topics in physics and collaborate on projects." },
        { id: 3, subject: "Literature", description: "Discuss classic and modern literature with peer group insights." },
        { id: 4, subject: "Engineering", description: "Collaborative projects and study sessions for engineering students." }
    ];

    return (
        <Container>
            <h1>Dashboard - Study Groups</h1>
            <Slider {...settings}>
                {studyGroups.map(group => (
                    <Card key={group.id} className="m-3">
                        <CardBody>
                            <CardTitle tag="h5">{group.subject}</CardTitle>
                            <CardText>{group.description}</CardText>
                            <Button color="primary">Join Group</Button>
                        </CardBody>
                    </Card>
                ))}
            </Slider>
        </Container>
    );
}

export default Dashboard;

