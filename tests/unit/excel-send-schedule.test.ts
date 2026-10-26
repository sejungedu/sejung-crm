/**
 * 엑셀 보내기 예약 발송 입력 + 예약 경로 단위 테스트.
 *
 * - scheduledAt 은 생략하면 null(즉시 발송), ISO 문자열이면 통과, 형식이 틀리면 한글 오류.
 * - 모든 예약은 자체 지연발송(CRM 보관 → cron 이 시각에 drain) — sendon 에 미리
 *   접수하지 않아야 발송 전까지 즉시 취소된다.
 */

import { describe, it, expect } from "vitest";
import { ExcelSendInputSchema } from "@/lib/schemas/excel-send";
import { SENDON_MIN_RESERVATION_MS } from "@/lib/messaging/schedule-window";

const base = {
  recipients: [{ name: "홍길동", phone: "010-1234-5678" }],
  type: "SMS" as const,
  body: "안내드립니다",
};

describe("ExcelSendInputSchema · scheduledAt", () => {
  it("생략하면 null(즉시 발송)", () => {
    const r = ExcelSendInputSchema.parse(base);
    expect(r.scheduledAt).toBeNull();
  });

  it("ISO 시각을 받는다", () => {
    const iso = "2026-10-27T01:00:00.000Z";
    const r = ExcelSendInputSchema.parse({ ...base, scheduledAt: iso });
    expect(r.scheduledAt).toBe(iso);
  });

  it("형식이 틀리면 한글 오류", () => {
    const r = ExcelSendInputSchema.safeParse({ ...base, scheduledAt: "내일 9시" });
    expect(r.success).toBe(false);
    expect(r.error?.issues[0]?.message).toBe("예약 시각 형식이 올바르지 않습니다");
  });
});

describe("예약 발송은 모두 CRM 보관(자체 지연발송)", () => {
  it("아무리 먼 예약도 sendon 네이티브 예약 기준에 못 미친다", () => {
    const thirtyDays = 30 * 24 * 60 * 60_000;
    expect(thirtyDays < SENDON_MIN_RESERVATION_MS).toBe(true);
  });
});
