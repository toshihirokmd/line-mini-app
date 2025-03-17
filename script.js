// あなたのLIFF IDとGASのWebアプリURLを設定
const LIFF_ID = "2007069764-dVrNbbq"; // LINE DevelopersコンソールからコピーしたLIFF ID
const GAS_URL = "https://script.google.com/macros/s/AKfycbyoiX4RnddSDj3X4NwqQpq7afOGU1fcVf87atZitemuItZiI4LtqRVw_R4k0jr70gEn/exec"; // GASをデプロイしたときのURL

// LIFF初期化
liff.init({
    liffId: LIFF_ID
}).then(() => {
    console.log("LIFF initialized");
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
        
        // GASにデータを送信
        const response = await fetch(GAS_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();
        console.log('Response:', result); // デバッグ用

        if (result.status === 'success') {
            alert('お問い合わせを受け付けました。');
            e.target.reset();
            
            // LIFFブラウザを閉じる
            if (liff.isInClient()) {
                liff.closeWindow();
            }
        } else {
            throw new Error(result.message || '送信に失敗しました');
        }
    } catch (error) {
        console.error('Error details:', error); // デバッグ用
        alert('エラーが発生しました: ' + error.message);
    } finally {
        // ボタンを元に戻す
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
    }
});
