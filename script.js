// あなたのLIFF IDとGASのWebアプリURLを設定
const LIFF_ID = "2007069762-6gb5JYYz"; // 開発用LIFF ID
const GAS_URL = "https://script.google.com/macros/s/AKfycby0rzwZlMhVUQ8oAbhfMl8ZcsIo7x0QHGczrBJcZKaAwczYUxuGfC2gq2ZJrYCC7F5Z/exec"; // GASをデプロイしたときのURL

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
    
    // フォームデータの取得
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        category: document.getElementById('category').value,
        message: document.getElementById('message').value
    };

    try {
        // LINEユーザー情報の取得
        if (liff.isLoggedIn()) {
            const profile = await liff.getProfile();
            formData.userId = profile.userId;
        }

        // GASにデータを送信（no-corsモードを使用）
        const response = await fetch(GAS_URL, {
            method: 'POST',
            mode: 'no-cors', // CORSエラーを回避
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        // no-corsモードではresponse.jsonが使えないため、成功とみなす
        console.log('Response received');
        alert('お問い合わせを受け付けました。');
        e.target.reset();
        
        // LIFFブラウザを閉じる
        if (liff.isInClient()) {
            liff.closeWindow();
        }

    } catch (error) {
        console.error('Error details:', error);
        alert('エラーが発生しました: ' + error.message);
    } finally {
        // ボタンを元に戻す
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
    }
});
