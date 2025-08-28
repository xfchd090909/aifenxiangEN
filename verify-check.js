// 验证页面的路径（根据实际情况修改）
const VERIFY_PAGE_PATH = 'frontend-verification.html';

// 当前页面的完整 URL（不含哈希值，避免影响跳转）
const currentPageUrl = window.location.href.split('https://aeafxen.dpdns.org')[0];

// 检查是否是验证页面本身（避免循环跳转）
const isVerifyPage = currentPageUrl.endsWith(VERIFY_PAGE_PATH);

// 验证状态的 key（使用 sessionStorage，区别于登录的 localStorage）
const VERIFY_STATUS_KEY = 'cfTurnstileVerified';

// 检查验证状态
function checkVerification() {
  // 如果是验证页面，不执行检查
  if (isVerifyPage) return;

  // 检查 sessionStorage 中的验证状态
  const isVerified = sessionStorage.getItem(VERIFY_STATUS_KEY) === 'true';
  
  if (!isVerified) {
    // 未验证：跳转至验证页面，并携带当前页面地址作为返回参数
    const redirectUrl = encodeURIComponent(currentPageUrl);
    window.location.href = `${VERIFY_PAGE_PATH}?redirect=${redirectUrl}`;
  }
}

// 页面加载时执行检查
window.addEventListener('load', checkVerification);
