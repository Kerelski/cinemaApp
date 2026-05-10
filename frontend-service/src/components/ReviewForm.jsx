export function ReviewForm({ form, editingReviewId, saving, onChange, onSubmit, onCancel }) {
  return (
    <form className="review-form" onSubmit={onSubmit}>
      <div className="form-title compact-title">
        <h3>{editingReviewId ? 'Edit review' : 'Add review'}</h3>
        {editingReviewId && (
          <button type="button" className="ghost compact" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
      <div className="field-row">
        <label>
          Rating
          <input name="rating" type="number" min="1" max="10" value={form.rating} onChange={onChange} required />
        </label>
      </div>
      <label>
        Comment
        <textarea name="comment" value={form.comment} onChange={onChange} rows="3" />
      </label>
      <button type="submit" disabled={saving}>
        {saving ? 'Saving...' : editingReviewId ? 'Update review' : 'Save review'}
      </button>
    </form>
  );
}
