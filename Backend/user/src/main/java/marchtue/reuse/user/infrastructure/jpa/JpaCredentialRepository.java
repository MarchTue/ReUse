package marchtue.reuse.user.infrastructure.jpa;

import java.util.UUID;
import marchtue.reuse.user.domain.model.Credential;
import marchtue.reuse.user.domain.repository.CredentialRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JpaCredentialRepository extends CredentialRepository,
    JpaRepository<Credential, UUID> {

}
