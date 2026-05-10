export function ReviewList({ reviews, currentUserEmail, isAdmin, onEdit, onDelete }) {
  if (reviews.length === 0) {
    return <p className="muted">No reviews yet.</p>;
  }

  return (
    <div className="review-list">
      {reviews.map((review) => {
        const canManage = isAdmin || review.authorEmail === currentUserEmail;

        return (
          <article className="review-item" key={review.id}>
            <div>
              <strong>{review.rating}/10</strong>
              <span>{review.authorName || review.authorEmail}</span>
            </div>
            {review.comment && <p>{review.comment}</p>}
            {canManage && (
              <div className="card-actions">
                <button type="button" className="secondary compact" onClick={() => onEdit(review)}>
                  Edit
                </button>
                <button type="button" className="danger compact" onClick={() => onDelete(review.id)}>
                  Delete
                </button>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
