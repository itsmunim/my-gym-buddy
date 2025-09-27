import React, { useState } from 'react';
import exercises from '../data/exercises.json';
import { Row, Col, Form } from 'react-bootstrap';
import ExerciseCard from '../components/ExerciseCard';

export default function Home() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const categories = [
    'All',
    ...new Set(exercises.flatMap((e) => e.categories)),
  ];

  const filtered = exercises.filter((e) => {
    const matchesQuery = e.name.toLowerCase().includes(query.toLowerCase());
    const matchesCat = category === 'All' || e.categories.includes(category);
    return matchesQuery && matchesCat;
  });

  return (
    <>
      <Form className="mb-3">
        <Row className="g-2">
          <Col xs={8}>
            <Form.Control
              placeholder="Search exercises by name"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </Col>
          <Col xs={4}>
            <Form.Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>
      </Form>
      <Row xs={1} md={2} lg={3} className="g-3">
        {filtered.map((ex) => (
          <Col key={ex.id}>
            <ExerciseCard exercise={ex} />
          </Col>
        ))}
      </Row>
    </>
  );
}
