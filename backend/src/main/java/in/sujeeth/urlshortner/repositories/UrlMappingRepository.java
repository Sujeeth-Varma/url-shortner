package in.sujeeth.urlshortner.repositories;

import in.sujeeth.urlshortner.models.UrlMapping;
import in.sujeeth.urlshortner.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UrlMappingRepository extends JpaRepository<UrlMapping, Long> {
    Optional<List<UrlMapping>> getByUser(User user);

    UrlMapping findByShortUrl(String shortUrl);

    List<UrlMapping> findByUser(User user);
}
