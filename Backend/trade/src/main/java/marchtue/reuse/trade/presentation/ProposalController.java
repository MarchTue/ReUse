package marchtue.reuse.trade.presentation;

import jakarta.validation.Valid;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import marchtue.reuse.trade.application.dto.request.CreateProposalRequest;
import marchtue.reuse.trade.application.service.ProposalService;
import marchtue.reuse.trade.global.dto.ApiResponse;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/be/v1/proposals")
public class ProposalController {

  private final ProposalService proposalService;

  // 거래 신청
  @PostMapping("/{postId}")
  public ApiResponse createProposal(
      @PathVariable UUID postId,
      @Valid @RequestBody CreateProposalRequest req
  ) {
    return proposalService.createProposal(postId, req);
  }

}
