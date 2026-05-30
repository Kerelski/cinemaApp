package com.cinema.app.movieservice.repository;

import com.cinema.app.movieservice.model.Screening;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface ScreeningRepository extends JpaRepository<Screening, Long> {

    List<Screening> findByMovieId(Long movieId);

    List<Screening> findByMovieIdOrderByStartTimeAsc(Long movieId);

    @Query("SELECT s FROM Screening s WHERE s.startTime >= :now ORDER BY s.startTime ASC")
    List<Screening> findUpcomingScreenings(@Param("now") LocalDateTime now);

    @Query("SELECT s FROM Screening s WHERE s.movie.id = :movieId AND s.startTime >= :now ORDER BY s.startTime ASC")
    List<Screening> findUpcomingScreeningsByMovieId(@Param("movieId") Long movieId, @Param("now") LocalDateTime now);

    @Query("SELECT s FROM Screening s WHERE s.startTime BETWEEN :start AND :end ORDER BY s.startTime ASC")
    List<Screening> findScreeningsBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    List<Screening> findByRoom(String room);

    @Query("SELECT DISTINCT s.room FROM Screening s")
    List<String> findAllRooms();

    void deleteByMovieId(Long movieId);
}
