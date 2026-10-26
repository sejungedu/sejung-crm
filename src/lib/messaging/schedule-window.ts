/**
 * 예약 발송 최소 리드타임.
 *
 * sendon 네이티브 예약은 최소 30분(공식 SDK 제약)이지만, 5~30분 구간은 자체 지연발송
 * (cron 이 시각 도래 시 drain 킥)으로 처리하므로 사용자는 5분 뒤부터 예약할 수 있다.
 * cron 주기(vercel.json: 매 1분)에 따라 실제 발송은 예약 시각 + 최대 ~1분이다.
 *
 * 서버(scheduleAction/reschedule)와 클라이언트(작성 화면 datetime 최소값)가 공유.
 */
export const SCHEDULE_MIN_LEAD_MS = 5 * 60_000;

/** 안내 문구용 라벨. */
export const SCHEDULE_MIN_LEAD_LABEL = "5분";

/**
 * 이 리드타임 이상이면 sendon 네이티브 예약(drain 이 reservation.datetime 으로 접수),
 * 미만이면 "자체 지연발송"(CRM 이 '대기' 로 보관, cron 이 시각 도래 시 drain 킥)이다.
 *
 * 2026-10-26: 모든 예약을 자체 지연발송으로 돌린다(무한대). sendon 은 예약 접수 직후
 * 약 10분간 취소를 거부하고 발송 10분 전부터도 거부해, 직원이 예약을 바로 취소하지
 * 못했다. CRM 보관 예약은 sendon 에 아무것도 넘기지 않았으므로 발송 직전까지 즉시
 * 취소된다. 실제 발송은 예약 시각 + 최대 ~1분(cron 주기) + 드레인 수 초.
 * 이미 sendon 에 접수된 기존 예약은 취소·재예약 경로가 그대로 처리한다.
 */
export const SENDON_MIN_RESERVATION_MS = Number.POSITIVE_INFINITY;
