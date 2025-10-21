import { Container, Row, Col, Button, Card } from "react-bootstrap";

const Home = () => {
  return (
    <div className="home-page w-100">
      <section className="py-5 text-center bg-white">
        <Container className="d-flex justify-content-center">
          <div style={{ maxWidth: "960px", width: "100%" }}>
            <h1 className="display-5 fw-bold text-dark mb-3">
              Hi, I'm <span className="text-danger">Joe Bennett</span>
            </h1>
            <p className="lead text-muted mb-4">
                Software engineer. Co-founder at Meta Space Lab.
            </p>
            <p>
                This web site is meant to show little projects I worked on, provide a some more information about myself and skills, and most important of all, for me to have fun!
            </p>
            <p>
                Some components make use of blockchain for data storage, while most API calls go through an express app I have deployed to an AWS Lambda that I am use API gateway
                to proxy calls to. As such, don't be surprised if backend calls are a little slow at times. As this is a personal website, I made the careful decision not to pay for EC2 fees
                just to show off pet projects.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-5 bg-light border-top">
        <Container className="d-flex justify-content-center">
          <div style={{ maxWidth: "960px", width: "100%" }}>
            <h2 className="text-center mb-5 text-dark">Featured Links</h2>
            <Row className="g-4">
              <Col md={4}>
                <Card className="h-100 shadow-sm border-0">
                  <Card.Body>
                    <Card.Title className="text-danger">Meta Space Lab</Card.Title>
                    <Card.Text>
                    </Card.Text>
                    <Button variant="outline-danger" href="https://www.metaspacelab.xyz/">
                      View
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="h-100 shadow-sm border-0">
                  <Card.Body>
                    <Card.Title className="text-danger">Linkedin</Card.Title>
                    <Card.Text>
                    </Card.Text>
                    <Button variant="outline-danger" href="https://www.linkedin.com/in/joeabennett/">
                      View
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="h-100 shadow-sm border-0">
                  <Card.Body>
                    <Card.Title className="text-danger">GitHub</Card.Title>
                    <Card.Text>
                    </Card.Text>
                    <Button variant="outline-danger" href="https://github.com/JoeAB">
                      View
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default Home;