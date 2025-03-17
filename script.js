// あなたのLIFF IDとGASのWebアプリURLを設定
const LIFF_ID = "2007069762-6gb5JYYz"; // 開発用LIFF ID
const GAS_URL = "https://script.google.com/macros/s/AKfycbwtjvXvRfKKPM8lJGeerSTVO0DIpZjwKL41fQpAYWmSK9ijoAfG3Xc5XrDV9l2qcvYq/exec"; // GASをデプロイしたときのURL

// LIFF初期化
liff.init({
    liffId: LIFF_ID
}).then(() => {
    console.log("LIFF initialized successfully");
}).catch((err) => {
    console.error("LIFF initialization failed", err);
});

// フォームの送信処理
document.getElementById('inquiryForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // 送信中の表示
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = '送信中...';
    
    try {
        // フォームデータの取得
        const formData = new URLSearchParams();
        formData.append('name', document.getElementById('name').value);
        formData.append('email', document.getElementById('email').value);
        formData.append('category', document.getElementById('category').value);
        formData.append('message', document.getElementById('message').value);

        // LINEユーザー情報の取得
        if (liff.isLoggedIn()) {
            const profile = await liff.getProfile();
            formData.append('userId', profile.userId);
        }

        // GASにデータを送信
        const response = await fetch(GAS_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString()
        });

        console.log('送信完了');
        alert('お問い合わせを受け付けました。');
        e.target.reset();
        
        if (liff.isInClient()) {
            liff.closeWindow();
        }

    } catch (error) {
        console.error('Error details:', error);
        alert('エラーが発生しました: ' + error.message);
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
    }
});
