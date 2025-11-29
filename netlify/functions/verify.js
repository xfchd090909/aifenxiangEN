// 后端验证核心逻辑（Netlify Function）
exports.handler = async (event) => {
    try {
        // 1. 解析前端传入的 Token
        const { token } = JSON.parse(event.body);
        if (!token) {
            return {
                statusCode: 400,
                body: JSON.stringify({ success: false, error: '缺少验证 Token' })
            };
        }

        // 2. 调用 Cloudflare Turnstile 官方验证 API
        const verifyResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                secret: process.env.TURNSTILE_SECRET, // 后端密钥（从 Netlify 环境变量读取，安全！）
                response: token,
                remoteip: event.headers['x-nf-client-ip'] || '' // Netlify 提供的用户真实 IP
            })
        });

        // 3. 返回验证结果给前端
        const verifyResult = await verifyResponse.json();
        return {
            statusCode: 200,
            body: JSON.stringify(verifyResult)
        };
    } catch (error) {
        console.error('验证失败:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, error: '服务器内部错误' })
        };
    }
};
