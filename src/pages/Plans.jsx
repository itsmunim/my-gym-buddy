import React from 'react';
import plans from '../data/plans.json';
import exercises from '../data/exercises.json';
import { Accordion, Card, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Plans() {
  return (
    <div>
      <h2>{plans.name}</h2>
      <Accordion defaultActiveKey="0">
        {plans.days.map((d, i) => (
          <Accordion.Item eventKey={String(i)} key={i}>
            <Accordion.Header>{d.day}</Accordion.Header>
            <Accordion.Body>
              {d.emphasis && (
                <p>
                  <strong>Focus:</strong> {d.emphasis}
                </p>
              )}
              {d.sets && (
                <p>
                  <strong>Sets/Reps:</strong> {d.sets}
                </p>
              )}
              {d.notes && (
                <p>
                  <em>{d.notes}</em>
                </p>
              )}
              <Row xs={1} md={2} lg={3} className="g-3">
                {d.exercises.map((id) => {
                  const ex = exercises.find((e) => e.id === id);
                  return (
                    <Col key={id}>
                      <Card
                        as={Link}
                        to={'/exercise/' + id}
                        style={{ textDecoration: 'none' }}
                        className="h-100"
                      >
                        <Card.Img
                          variant="top"
                          src={ex.thumbnail}
                          style={{ height: 180, objectFit: 'cover' }}
                        />
                        <Card.Body>
                          <Card.Title>{ex.name}</Card.Title>
                          <Card.Text>{ex.short}</Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
}
