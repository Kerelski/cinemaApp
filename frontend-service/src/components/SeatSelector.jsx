import { useState } from 'react';

export function SeatSelector({ seats, selectedSeats, onSeatToggle, maxSeats = 10 }) {
  const [hoveredSeat, setHoveredSeat] = useState(null);

  const seatsByRow = seats.reduce((acc, seat) => {
    const row = seat.row;
    if (!acc[row]) acc[row] = [];
    acc[row].push(seat);
    return acc;
  }, {});

  const sortedRows = Object.keys(seatsByRow).sort();

  function handleSeatClick(seat) {
    if (seat.reserved) return;
    
    const isSelected = selectedSeats.includes(seat.seatNumber);
    if (!isSelected && selectedSeats.length >= maxSeats) {
      return;
    }
    
    onSeatToggle(seat.seatNumber);
  }

  return (
    <div className="seat-selector">
      <div className="screen-indicator">
        <div className="screen">SCREEN</div>
      </div>
      
      <div className="seats-container">
        {sortedRows.map(row => (
          <div key={row} className="seat-row">
            <span className="row-label">{row}</span>
            <div className="seats">
              {seatsByRow[row]
                .sort((a, b) => a.number - b.number)
                .map(seat => {
                  const isSelected = selectedSeats.includes(seat.seatNumber);
                  const isHovered = hoveredSeat === seat.seatNumber;
                  
                  let seatClass = 'seat';
                  if (seat.reserved) seatClass += ' reserved';
                  else if (isSelected) seatClass += ' selected';
                  else if (isHovered) seatClass += ' hovered';
                  
                  return (
                    <button
                      key={seat.seatNumber}
                      className={seatClass}
                      onClick={() => handleSeatClick(seat)}
                      onMouseEnter={() => setHoveredSeat(seat.seatNumber)}
                      onMouseLeave={() => setHoveredSeat(null)}
                      disabled={seat.reserved}
                      title={seat.reserved ? 'Taken' : seat.seatNumber}
                    >
                      {seat.number}
                    </button>
                  );
                })}
            </div>
            <span className="row-label">{row}</span>
          </div>
        ))}
      </div>
      
      <div className="seat-legend">
        <div className="legend-item">
          <div className="seat-example available"></div>
          <span>Available</span>
        </div>
        <div className="legend-item">
          <div className="seat-example selected"></div>
          <span>Chosen</span>
        </div>
        <div className="legend-item">
          <div className="seat-example reserved"></div>
          <span>Taken</span>
        </div>
      </div>
    </div>
  );
}
