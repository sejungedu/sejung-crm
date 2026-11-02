-- 마스터 교차 발신 (2026-11-02)
--
-- 마스터는 받는 학생의 분원과 다른 분원 번호로 보낼 수 있다(예: 대치 학생에게
-- 반포 중등관 번호로). sendon 계정은 번호가 등록된 분원을 따라가야 하므로, 캠페인에
-- 발신 분원을 따로 기록한다. NULL 이면 기존처럼 branch(수신 분원)와 같다.

ALTER TABLE public.crm_campaigns
  ADD COLUMN IF NOT EXISTS sender_branch TEXT;

COMMENT ON COLUMN public.crm_campaigns.sender_branch IS
  '발신 분원(sendon 계정·발신번호·브랜드명 기준). NULL=branch 와 동일. 마스터가 다른 분원 번호로 보낼 때만 기록';
