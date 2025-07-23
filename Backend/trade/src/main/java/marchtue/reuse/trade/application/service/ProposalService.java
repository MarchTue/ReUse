package marchtue.reuse.trade.application.service;

import java.util.UUID;
import lombok.RequiredArgsConstructor;
import marchtue.reuse.trade.application.dto.request.CreateProposalRequest;
import marchtue.reuse.trade.application.dto.response.AcceptProposalResponse;
import marchtue.reuse.trade.application.dto.response.CreateProposalResponse;
import marchtue.reuse.trade.domain.enums.PostStateEnum;
import marchtue.reuse.trade.domain.enums.ProposalStateEnum;
import marchtue.reuse.trade.domain.enums.ProposalTradeTypeEnum;
import marchtue.reuse.trade.domain.model.Post;
import marchtue.reuse.trade.domain.model.Proposal;
import marchtue.reuse.trade.domain.repository.PostRepository;
import marchtue.reuse.trade.domain.repository.ProposalRepository;
import marchtue.reuse.trade.exception.BusinessException;
import marchtue.reuse.trade.exception.ErrorCode;
import marchtue.reuse.trade.global.dto.ApiResponse;
import marchtue.reuse.trade.global.util.RequestUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProposalService {

  private final PostService postService;
  private final PostRepository postRepository;
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

  @Transactional
  public ApiResponse acceptProposal(UUID proposalId) {
    Proposal proposal = findById(proposalId);
    Post post = proposal.getPost();
    if (!post.getPostState().equals(PostStateEnum.IN_PROGRESS)) {
      throw new BusinessException(ErrorCode.BAD_REQUEST);
    }
    UUID currentId = RequestUtil.getCurrentUserId();
    if (!post.getCreatedBy().equals(currentId)) {
      throw new BusinessException(ErrorCode.BAD_REQUEST);
    }
    if (!proposal.getState().equals(ProposalStateEnum.WAIT)) {
      throw new BusinessException(ErrorCode.BAD_REQUEST);
    }
    post.updatePostState(PostStateEnum.TRADING);
    postRepository.save(post);
    proposal.acceptProposal();
    proposalRepository.save(proposal);
    AcceptProposalResponse res = new AcceptProposalResponse(
        proposal.getCreatedBy(), proposal.getType(), proposal.getAddress()
    );

    return ApiResponse.ok(res);
  }

  public Proposal findById(UUID proposalId) {
    return proposalRepository.findById(proposalId).orElse(null);
  }
}
