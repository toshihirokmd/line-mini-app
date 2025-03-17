// あなたのLIFF IDとGASのWebアプリURLを設定
const LIFF_ID = "2007069762-6gb5JYYz"; // 開発用LIFF ID
const GAS_URL = "https://script.google.com/macros/s/AKfycbxSZzSnhe3Blbk77F9ITcL_ubq-Y7YOYN7voZJdSnErD4M_NAYTePCkWrQC0x9RTpUs/exec"; // GASをデプロイしたときのURL

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
    
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = '送信中...';
    
    try {
        const formData = new URLSearchParams();
        const data = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            category: document.getElementById('category').value,
            message: document.getElementById('message').value
        };
        
        // フォームデータの作成
        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value);
        });

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

        // 送信完了メッセージをLINEで送信
        if (liff.isInClient()) {
            // LINEアプリ内での処理
            await liff.sendMessages([
                {
                    type: 'flex',
                    altText: 'お問い合わせ内容の確認',
                    contents: {
                        type: 'bubble',
                        header: {
                            type: 'box',
                            layout: 'vertical',
                            contents: [
                                {
                                    type: 'text',
                                    text: 'お問い合わせ内容',
                                    weight: 'bold',
                                    size: 'lg'
                                }
                            ]
                        },
                        body: {
                            type: 'box',
                            layout: 'vertical',
                            contents: [
                                {
                                    type: 'box',
                                    layout: 'vertical',
                                    margin: 'lg',
                                    spacing: 'sm',
                                    contents: [
                                        {
                                            type: 'box',
                                            layout: 'baseline',
                                            spacing: 'sm',
                                            contents: [
                                                {
                                                    type: 'text',
                                                    text: 'お名前',
                                                    color: '#aaaaaa',
                                                    size: 'sm',
                                                    flex: 1
                                                },
                                                {
                                                    type: 'text',
                                                    text: data.name,
                                                    wrap: true,
                                                    size: 'sm',
                                                    flex: 4
                                                }
                                            ]
                                        },
                                        {
                                            type: 'box',
                                            layout: 'baseline',
                                            spacing: 'sm',
                                            contents: [
                                                {
                                                    type: 'text',
                                                    text: 'カテゴリ',
                                                    color: '#aaaaaa',
                                                    size: 'sm',
                                                    flex: 1
                                                },
                                                {
                                                    type: 'text',
                                                    text: data.category,
                                                    wrap: true,
                                                    size: 'sm',
                                                    flex: 4
                                                }
                                            ]
                                        },
                                        {
                                            type: 'box',
                                            layout: 'baseline',
                                            spacing: 'sm',
                                            contents: [
                                                {
                                                    type: 'text',
                                                    text: '内容',
                                                    color: '#aaaaaa',
                                                    size: 'sm',
                                                    flex: 1
                                                },
                                                {
                                                    type: 'text',
                                                    text: data.message,
                                                    wrap: true,
                                                    size: 'sm',
                                                    flex: 4
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        footer: {
                            type: 'box',
                            layout: 'vertical',
                            contents: [
                                {
                                    type: 'text',
                                    text: '担当者より順次ご連絡いたします。',
                                    wrap: true,
                                    size: 'sm',
                                    color: '#888888'
                                }
                            ]
                        }
                    }
                }
            ]);
            
            // フォームを閉じる
            liff.closeWindow();
        } else {
            // ブラウザでの表示用
            alert('お問い合わせを受け付けました。');
            e.target.reset();
        }

    } catch (error) {
        console.error('Error details:', error);
        alert('エラーが発生しました: ' + error.message);
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
    }
});
