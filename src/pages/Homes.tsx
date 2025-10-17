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
              I'm a software developer passionate about building modern, efficient, and elegant web applications.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-5 bg-light border-top">
        <Container className="d-flex justify-content-center">
          <div style={{ maxWidth: "960px", width: "100%" }}>
            <h2 className="text-center mb-5 text-dark">Featured Projects</h2>
            <Row className="g-4">
              <Col md={4}>
                <Card className="h-100 shadow-sm border-0">
                  <Card.Body>
                    <Card.Title className="text-danger">Project One</Card.Title>
                    <Card.Text>
                      A web app built with React and TypeScript for managing personal finance efficiently.
                    </Card.Text>
                    <Button variant="outline-danger" href="#">
                      View Details
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="h-100 shadow-sm border-0">
                  <Card.Body>
                    <Card.Title className="text-danger">Project Two</Card.Title>
                    <Card.Text>
                      A minimalist portfolio template designed to showcase creative work and development skills.
                    </Card.Text>
                    <Button variant="outline-danger" href="#">
                      View Details
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="h-100 shadow-sm border-0">
                  <Card.Body>
                    <Card.Title className="text-danger">Project Three</Card.Title>
                    <Card.Text>
                      A blockchain-based tool for verifying digital assets on the XRP Ledger.
                    </Card.Text>
                    <Button variant="outline-danger" href="#">
                      View Details
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