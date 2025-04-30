import {
  EventStreamContentType,
  fetchEventSource,
} from "@microsoft/fetch-event-source";
import { useCallback, useRef, useSyncExternalStore } from "react";

import { API_URL } from "@/config";
import storage from "@/utils/storage";

export type GetUncheckedNotificationCountResponse = {
  count: number;
};

/**
 * お知らせ数を取得するフック
 * @returns count カウント
 */
export function useFetchUncheckedNotificationCount():
  | GetUncheckedNotificationCountResponse
  | undefined {
  const data$ = useRef<GetUncheckedNotificationCountResponse>();

  const subscribe = useCallback((onStoreChange: () => void): (() => void) => {
    const controller = new AbortController();
    const token = storage.getToken() as string;

    fetchEventSource(`${API_URL}/unchecked_notification_count`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      onerror(err: Error) {
        onStoreChange();
        throw err;
      },
      async onopen(response: {
        ok: boolean;
        headers: { get: (arg0: string) => string | null };
      }) {
        if (
          !response.ok ||
          !(response.headers.get("content-type") === EventStreamContentType)
        ) {
          throw new Error("クライアントエラー");
        }
        return;
      },
      onclose() {
        throw new Error("サーバーエラー");
      },
      onmessage(event: { event: string; data: string }) {
        if (event.event === "error") {
          throw Error("サーバーエラー");
        }
        const parsedData = JSON.parse(
          event.data
        ) as GetUncheckedNotificationCountResponse;
        data$.current = parsedData;
        // 通知
        if (Notification.permission === "granted" && parsedData.count > 0) {
          new Notification("ポイントアプリ", {
            body: parsedData.count + "件の未読通知があります",
            silent: false,
            icon: "/icon-192.png",
            image: "/icon-192.png",
          });
        }
        onStoreChange();
      },
      signal: controller.signal,
    });

    return () => {
      controller.abort();
    };
  }, []);

  return useSyncExternalStore(subscribe, () => data$.current);
}
