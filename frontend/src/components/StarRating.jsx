const StarRating = ({ value, onChange, size = 36 }) => {
  return (
    <div className="star-rating d-flex justify-content-center gap-1" role="group" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`star-btn ${star <= value ? "active" : ""}`}
          style={{ fontSize: size }}
          onClick={() => onChange(star)}
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
        >
          ★
        </button>
      ))}
    </div>
  );
};

export default StarRating;
