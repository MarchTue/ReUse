package marchtue.reuse.auth.domain.repository;


import marchtue.reuse.auth.domain.model.UserSession;

public interface UserSessionRepository {


  UserSession save(UserSession session);
}
