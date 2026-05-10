import { ReviewForm } from './ReviewForm';
import { ReviewList } from './ReviewList';

export function MovieReviewsPanel({
  reviews,
  reviewForm,
  editingReviewId,
  saving,
  currentUserEmail,
  isAdmin,
  onReviewChange,
  onReviewSubmit,
  onCancelReviewEdit,
  onEditReview,
  onDeleteReview,
}) {
  return (
    <section className="reviews-panel">
      <ReviewForm
        form={reviewForm}
        editingReviewId={editingReviewId}
        saving={saving}
        onChange={onReviewChange}
        onSubmit={onReviewSubmit}
        onCancel={onCancelReviewEdit}
      />
      <ReviewList
        reviews={reviews}
        currentUserEmail={currentUserEmail}
        isAdmin={isAdmin}
        onEdit={onEditReview}
        onDelete={onDeleteReview}
      />
    </section>
  );
}
