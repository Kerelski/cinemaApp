export function MovieForm({ form, editingMovieId, saving, onChange, onCancelEdit, onSubmit, generatingDescription, onGenerateDescription }) {
    return (
        <form className="movie-form" onSubmit={onSubmit}>
            <div className="form-title">
                <h2>{editingMovieId ? 'Edit movie' : 'Add movie'}</h2>
                {editingMovieId && (
                    <button type="button" className="ghost compact" onClick={onCancelEdit}>
                        Cancel
                    </button>
                )}
            </div>
            <label>
                Title
                <input name="title" value={form.title} onChange={onChange} required />
            </label>
            <label>
                Director
                <input name="director" value={form.director} onChange={onChange} />
            </label>
            <div className="field-row">
                <label>
                    Year
                    <input
                        name="releaseYear"
                        type="number"
                        min="1888"
                        max="2100"
                        value={form.releaseYear}
                        onChange={onChange}
                    />
                </label>
                <label>
                    Rating
                    <input name="rating" type="number" min="0" max="10" step="0.1" value={form.rating} onChange={onChange} />
                </label>
            </div>
            <label>
                Poster URL
                <input name="posterUrl" type="url" value={form.posterUrl} onChange={onChange} />
            </label>

            {/* Nagłówek sekcji z opisem i przyciskiem AI */}
            <div
                className="field-row"
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '6px',
                }}
            >
                <label htmlFor="description" style={{ margin: 0 }}>Description</label>
                <button
                    type="button"
                    className="ghost compact"
                    onClick={onGenerateDescription}
                    disabled={generatingDescription || !form.title}
                    style={{
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                        lineHeight: 1,
                        padding: '6px 12px',
                    }}
                >
                    {generatingDescription ? 'Generating...' : '✨ Generate with AI'}
                </button>
            </div>

            <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={onChange}
                rows={4}
                placeholder="Enter description or generate with AI..."
                style={{
                    width: '100%',
                    display: 'block',
                    marginBottom: '18px', /* Odstęp przed przyciskiem submit */
                }}
            />

            <button type="submit" disabled={saving}>
                {saving ? 'Saving...' : editingMovieId ? 'Update movie' : 'Save movie'}
            </button>
        </form>
    );
}