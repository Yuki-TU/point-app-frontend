import * as snackbar from "@/lib/toast";

/**
 * 通知の許可を求める
 *
 * 通知が許可されていない場合、許可を求める
 *
 * 通知が許可されている場合、通知は許可されていますと表示する
 * @returns void
 */
export function askNotificationPermission() {
  if (!("Notification" in window)) return;
  if (window.Notification.permission !== "granted") {
    window.Notification.requestPermission().then(() => {
      snackbar.success("通知を許可しました");
    });
    return;
  }
  window.Notification.requestPermission(function () {
    snackbar.success("通知は許可されています");
  });
}
