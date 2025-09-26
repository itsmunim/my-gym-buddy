import React from 'react'
import { useParams, Link } from 'react-router-dom'
import exercises from '../data/exercises.json'
import { Row, Col, Button } from 'react-bootstrap'

export default function ExerciseDetail(){
  const { id } = useParams()
  const ex = exercises.find(x=>x.id===id)
  if(!ex) return <div>Exercise not found</div>

  const youtubeEmbed = ex.youtubeEmbed || `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(ex.youtubeQuery)}`

  return (
    <div>
      <Button as={Link} to="/" variant="light" className="mb-3">← Back</Button>
      <h2>{ex.name}</h2>
      <p><strong>Categories:</strong> {ex.categories.join(', ')}</p>
      <p>{ex.short}</p>
      <Row>
        {ex.images.map((img, idx)=> (
          <Col xs={12} md={4} key={idx} className="mb-3">
            <img src={img} alt={`${ex.name} step ${idx+1}`} style={{width:'100%', borderRadius:6}} />
            <p className="mt-2"><strong>Step {idx+1}:</strong> {ex.steps[idx]}</p>
          </Col>
        ))}
      </Row>
      <div className="ratio ratio-16x9 mb-3">
        <iframe src={youtubeEmbed} title={ex.name + ' demo'} allowFullScreen />
      </div>
      <p><em>{ex.youtubeEmbed ? 'Professional exercise demonstration video' : 'YouTube search results for this exercise'}.</em></p>
    </div>
  )
}
