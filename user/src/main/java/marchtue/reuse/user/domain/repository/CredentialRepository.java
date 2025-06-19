package marchtue.reuse.user.domain.repository;

import marchtue.reuse.user.domain.model.Credential;

public interface CredentialRepository {

  boolean findByDid(String did);

  Credential save(Credential credential);
}
