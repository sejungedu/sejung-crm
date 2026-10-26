-- 엑셀 보내기 예약 발송 (2026-10-26)
--
-- 엑셀 명단 수신자는 학생(student_id)과 연결되지 않아, 예약 시각에 드레인이
-- {이름} 을 채울 이름을 crm_students 에서 찾을 수 없다. 적재 시 이름을 메시지 행에
-- 함께 저장해 두고, 드레인은 student_id 가 없을 때 이 값을 쓴다.

ALTER TABLE public.crm_messages
  ADD COLUMN IF NOT EXISTS recipient_name TEXT;

COMMENT ON COLUMN public.crm_messages.recipient_name IS
  '수신자 이름 (엑셀 보내기처럼 학생과 연결되지 않은 수신자의 {이름} 치환용. 학생 발송은 NULL)';
