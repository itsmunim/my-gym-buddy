import React from 'react'
import { Card, Badge } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export default function ExerciseCard({exercise}){
  return (
    <Card className="h-100">
      <Link to={'/exercise/'+exercise.id}>
        <Card.Img variant="top" src={exercise.thumbnail} style={{objectFit:'cover', height:200}} />
      </Link>
      <Card.Body>
        <Card.Title><Link to={'/exercise/'+exercise.id} style={{textDecoration:'none'}}>{exercise.name}</Link></Card.Title>
        <Card.Text>{exercise.short}</Card.Text>
        <div>
          {exercise.categories.map(c=> <Badge className="me-1" bg="secondary" key={c}>{c}</Badge>)}
        </div>
      </Card.Body>
    </Card>
  )
}
