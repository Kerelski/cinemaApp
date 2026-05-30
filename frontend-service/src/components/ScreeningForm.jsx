import { ROOMS } from '../constants/forms';

export function ScreeningForm({ form, movies, editingScreeningId, saving, onChange, onCancelEdit, onSubmit }) {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  const minDateTime = now.toISOString().slice(0, 16);

  return (
    <form className="movie-form stack-form" onSubmit={onSubmit}>
      <div className="form-title">
        <h2>{editingScreeningId ? 'Edit screening' : 'New screeening'}</h2>
        {editingScreeningId && (
          <button type="button" className="ghost compact" onClick={onCancelEdit}>
            Cancel
          </button>
        )}
      </div>

      <label>
        Film
        <select name="movieId" value={form.movieId} onChange={onChange} required>
          <option value="">Chose movie...</option>
          {movies.map(movie => (
            <option key={movie.id} value={movie.id}>
              {movie.title}
            </option>
          ))}
        </select>
      </label>

      <label>
        Date and time
        <input
          type="datetime-local"
          name="startTime"
          value={form.startTime}
          onChange={onChange}
          min={minDateTime}
          required
        />
      </label>

      <div className="field-row">
        <label>
          Room
          <select name="room" value={form.room} onChange={onChange} required>
            <option value="">Choose room...</option>
            {ROOMS.map(room => (
              <option key={room} value={room}>{room}</option>
            ))}
          </select>
        </label>

        <label>
          Price (PLN)
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={onChange}
            min="1"
            step="0.01"
            placeholder="25.00"
          />
        </label>
      </div>

      <button type="submit" disabled={saving}>
        {saving ? 'Saving...' : editingScreeningId ? 'Save changes' : 'Add screening'}
      </button>
    </form>
  );
}
