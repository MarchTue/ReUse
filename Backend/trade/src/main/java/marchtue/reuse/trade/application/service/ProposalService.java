package marchtue.reuse.trade.application.service;

import java.util.UUID;
import lombok.RequiredArgsConstructor;
import marchtue.reuse.trade.application.dto.request.CreateProposalRequest;
import marchtue.reuse.trade.application.dto.response.CreateProposalResponse;
import marchtue.reuse.trade.domain.enums.PostStateEnum;
import marchtue.reuse.trade.domain.enums.ProposalStateEnum;
import marchtue.reuse.trade.domain.enums.ProposalTradeTypeEnum;
import marchtue.reuse.trade.domain.model.Post;
import marchtue.reuse.trade.domain.model.Proposal;
import marchtue.reuse.trade.domain.repository.ProposalRepository;
import marchtue.reuse.trade.exception.BusinessException;
import marchtue.reuse.trade.exception.ErrorCode;
import marchtue.reuse.trade.global.dto.ApiResponse;
import marchtue.reuse.trade.global.util.RequestUtil;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProposalService {

  private final PostService postService;
  private final ProposalRepository proposalRepository;

  public ApiResponse createProposal(UUID postId, CreateProposalRequest req) {
    Post post = postService.findById(postId);
    if (!post.getPostState().equals(PostStateEnum.IN_PROGRESS)) {
      throw new BusinessException(ErrorCode.BAD_REQUEST);
    }
    UUID sellerId = post.getCreatedBy();
    UUID currentId = RequestUtil.getCurrentUserId();
    if (sellerId.equals(currentId)) {
      throw new BusinessException(ErrorCode.BAD_REQUEST);
    }
    if (!req.direct() && !req.parcel()) {
      throw new BusinessException(ErrorCode.BAD_REQUEST);
    }
    ProposalTradeTypeEnum tradeType = req.direct()
        ? ProposalTradeTypeEnum.DIRECT
        : ProposalTradeTypeEnum.PARCEL;
    String address = tradeType == ProposalTradeTypeEnum.PARCEL ? req.address() : null;
    Proposal proposal = Proposal.create(
        tradeType,
        req.price(),
        address,
        ProposalStateEnum.WAIT,
        post
    );
    Proposal savedProposal = proposalRepository.save(proposal);
    CreateProposalResponse res = new CreateProposalResponse(savedProposal.getId());
    return ApiResponse.ok(res);
  }
}
