import { Modal, Form, Button } from "react-bootstrap";
import StarRating from "./StarRating";

const ReviewModal = ({ show, onHide, rating, onRatingChange, review, onReviewChange, onSubmit, submitting }) => (
  <Modal show={show} onHide={onHide} centered className="review-modal" backdrop="static">
    <Modal.Header closeButton className="border-0 pb-0">
      <Modal.Title className="w-100 text-center">Rate your provider</Modal.Title>
    </Modal.Header>
    <Form onSubmit={onSubmit}>
      <Modal.Body className="text-center pt-2">
        <p className="text-muted mb-4">How was the service? Tap the stars below.</p>
        <StarRating value={rating} onChange={onRatingChange} size={42} />
        <p className="mt-3 mb-0 fw-semibold text-primary">
          {rating === 5 ? "Excellent!" : rating >= 4 ? "Great!" : rating >= 3 ? "Good" : rating >= 2 ? "Fair" : "Poor"}
        </p>
        <Form.Group className="mt-4 text-start">
          <Form.Label>Your review (optional)</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Share your experience..."
            value={review}
            onChange={(e) => onReviewChange(e.target.value)}
            className="sh-input"
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer className="border-0 pt-0 justify-content-center gap-2">
        <Button variant="light" onClick={onHide} disabled={submitting}>
          Later
        </Button>
        <Button type="submit" className="btn-sh-primary px-4" disabled={submitting}>
          {submitting ? "Submitting…" : "Submit Review"}
        </Button>
      </Modal.Footer>
    </Form>
  </Modal>
);

export default ReviewModal;
