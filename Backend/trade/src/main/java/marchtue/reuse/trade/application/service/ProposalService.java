package marchtue.reuse.trade.application.service;

import java.util.UUID;
import lombok.RequiredArgsConstructor;
import marchtue.reuse.trade.application.dto.request.CreateProposalRequest;
import marchtue.reuse.trade.application.dto.response.AcceptProposalResponse;
import marchtue.reuse.trade.application.dto.response.CreateProposalResponse;
import marchtue.reuse.trade.domain.enums.DealTypeEnum;
import marchtue.reuse.trade.domain.enums.PostStateEnum;
import marchtue.reuse.trade.domain.enums.ProposalDealTypeEnum;
import marchtue.reuse.trade.domain.enums.ProposalStateEnum;
import marchtue.reuse.trade.domain.model.Deal;
import marchtue.reuse.trade.domain.model.Post;
import marchtue.reuse.trade.domain.model.Proposal;
import marchtue.reuse.trade.domain.repository.DealRepository;
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
  private final DealRepository dealRepository;

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
    ProposalDealTypeEnum tradeType = req.direct()
        ? ProposalDealTypeEnum.DIRECT
        : ProposalDealTypeEnum.PARCEL;
    String address = tradeType == ProposalDealTypeEnum.PARCEL ? req.address() : null;
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
    DealTypeEnum tradeType =
        proposal.getType().equals(ProposalDealTypeEnum.DIRECT) ? DealTypeEnum.DIRECT
            : DealTypeEnum.PARCEL;
    Deal deal = Deal.create(tradeType, proposal);

    post.updatePostState(PostStateEnum.TRADING);
    proposal.acceptProposal();
    postRepository.save(post);
    proposalRepository.save(proposal);
    dealRepository.save(deal);
    // 블록체인 구현 후 이벤트 발송 필요
    AcceptProposalResponse res = new AcceptProposalResponse(
        proposal.getCreatedBy(), proposal.getType(), proposal.getAddress()
    );

    return ApiResponse.ok(res);
  }

  public ApiResponse rejectProposal(UUID proposalId) {
    Proposal proposal = findById(proposalId);
    Post post = proposal.getPost();
    if (!post.getPostState().equals(PostStateEnum.TRADING)) {
      throw new BusinessException(ErrorCode.BAD_REQUEST);
    }
    UUID currentId = RequestUtil.getCurrentUserId();
    if (!post.getCreatedBy().equals(currentId)) {
      throw new BusinessException(ErrorCode.BAD_REQUEST);
    }
    if (proposal.getState().equals(ProposalStateEnum.CANCLED)) {
      throw new BusinessException(ErrorCode.BAD_REQUEST);
    }
    proposal.rejectProposal();
    proposalRepository.save(proposal);
    return ApiResponse.ok();
  }

  public ApiResponse cancelProposal(UUID proposalId) {
    Proposal proposal = findById(proposalId);
    if (proposal == null) {
      throw new BusinessException(ErrorCode.BAD_REQUEST);
    }
    UUID currentId = RequestUtil.getCurrentUserId();
    if (!proposal.getCreatedBy().equals(currentId)) {
      throw new BusinessException(ErrorCode.BAD_REQUEST);
    }
    if (!proposal.getState().equals(ProposalStateEnum.WAIT)) {
      throw new BusinessException(ErrorCode.BAD_REQUEST);
    }
    proposal.cancelProposal();
    proposal.deleteBase();
    proposalRepository.save(proposal);
    return ApiResponse.ok();
  }

  public Proposal findById(UUID proposalId) {
    return proposalRepository.findById(proposalId).orElse(null);
  }


}
