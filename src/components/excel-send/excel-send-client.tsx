"use client";

import { useState } from "react";
import { ExcelUploadPanel } from "./excel-upload-panel";
import { ExcelRecipientsPreview } from "./excel-recipients-preview";
import { ExcelComposePanel } from "./excel-compose-panel";
import type { ParsedRecipientRow } from "./excel-parse";
import type { Division } from "@/config/divisions";

interface Props {
  /** 발송 분원 기본값. 빈 문자열이면 마스터가 직접 고른다. */
  defaultBranch: string;
  /** 비마스터 계정 고정 명의. null 이면 마스터(분원·명의 자유 선택). */
  lockedDivision: Division | null;
}

/**
 * 엑셀 보내기 클라이언트 오케스트레이터.
 *
 * 단계 카드 흐름:
 *   ① 양식 다운로드 + ② 업로드/파싱 (ExcelUploadPanel)
 *   ③ 미리보기 표 (ExcelRecipientsPreview) — 파싱 결과 있을 때만
 *   ④ 본문 작성 + ⑤ 발송 (ExcelComposePanel) — 파싱 결과 있을 때만
 *
 * 파싱·검증·수신거부 조회는 업로드 패널이 끝낸 뒤 rows 로 끌어올린다.
 */
export function ExcelSendClient({ defaultBranch, lockedDivision }: Props) {
  const [rows, setRows] = useState<ParsedRecipientRow[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleParsed = (parsed: ParsedRecipientRow[], name?: string) => {
    setRows(parsed);
    if (name !== undefined) setFileName(name);
    else if (parsed.length === 0) setFileName(null);
  };

  return (
    <div className="space-y-6">
      <ExcelUploadPanel
        fileName={fileName}
        onParsed={(parsed, name) => handleParsed(parsed, name)}
      />

      {rows.length > 0 && (
        <>
          <ExcelRecipientsPreview rows={rows} />
          <ExcelComposePanel
            rows={rows}
            defaultBranch={defaultBranch}
            lockedDivision={lockedDivision}
          />
        </>
      )}
    </div>
  );
}
