/**
 * 드레인 워커 "초대링크 모드" 본문 변환 단위 테스트.
 *
 * 설명회 발송은 학생별 고유 신청 URL 을 sendon name 슬롯(#{이름})에 박는다.
 * applyInviteLinkToken 이 본문의 {초대링크} 를 #{이름} 로 변환하는지(없으면 그대로),
 * 그룹 발송 본문(토큰 없음)에 안전하게 동작하는지 검증한다.
 */

import { describe, it, expect } from "vitest";
import { applyInviteLinkToken } from "@/lib/messaging/drain-campaign";

describe("applyInviteLinkToken · 초대링크 → sendon name 슬롯", () => {
  it("{초대링크} 1개를 #{이름} 로 치환한다", () => {
    const out = applyInviteLinkToken("[설명회] 신청: {초대링크}");
    expect(out).toBe("[설명회] 신청: #{이름}");
    expect(out).not.toContain("{초대링크}");
  });

  it("{초대링크} 여러 개를 모두 #{이름} 로 치환한다", () => {
    const out = applyInviteLinkToken("A {초대링크} B {초대링크}");
    expect(out).toBe("A #{이름} B #{이름}");
  });

  it("{초대링크} 가 없으면 링크를 붙이지 않고 본문 그대로 둔다", () => {
    const out = applyInviteLinkToken("[설명회] 자세한 안내드립니다");
    expect(out).toBe("[설명회] 자세한 안내드립니다");
    expect(out).not.toContain("#{이름}");
  });
});
