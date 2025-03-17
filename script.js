async function initializeLiff() {
    try {
        await liff.init({
            liffId: "1655978850-AYGakM88"
        });

        if (!liff.isLoggedIn()) {
            liff.login();
        }
    } catch (err) {
        console.error('LIFF Initialization failed', err);
    }
}

async function handleFormSubmit(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    if (!name || !email || !message) {
        alert('全ての項目を入力してください。');
        return;
    }

    try {
        const profile = await liff.getProfile();
        const userId = profile.userId;
        
        const response = await fetch('https://script.google.com/macros/s/AKfycbzDh0Y48jmm88_9dQAHRfwi-cghxV1aU0hRdEP1IOLPCrmng031Cqo7xFXieLfjCO6M/exec', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                email: email,
                message: message,
                userId: userId
            })
        });

        if (response.ok) {
            alert('送信が完了しました。');
            document.getElementById('surveyForm').reset();
            if (liff.isInClient()) {
                liff.closeWindow();
            }
        } else {
            throw new Error('送信に失敗しました。');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('エラーが発生しました。もう一度お試しください。');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    initializeLiff();
    document.getElementById('surveyForm').addEventListener('submit', handleFormSubmit);
});
