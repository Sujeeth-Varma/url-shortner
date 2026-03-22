package in.sujeeth.urlshortner.repositories;

import in.sujeeth.urlshortner.models.ClickEvent;
import in.sujeeth.urlshortner.models.UrlMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;


@Repository
public interface ClickEventRepository extends JpaRepository<ClickEvent, Long> {
    List<ClickEvent> findByUrlMappingAndClickDateBetween(UrlMapping urlMapping, LocalDateTime clickDate, LocalDateTime clickDate2);

    List<ClickEvent> findByUrlMappingInAndClickDateBetween(Collection<UrlMapping> urlMappings, LocalDateTime clickDateAfter, LocalDateTime clickDateBefore);
}