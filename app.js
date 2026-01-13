const API_BASE = 'http://localhost:3000';

document.getElementById('register-btn').addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const name = document.getElementById('name').value;
    if (!email || !name) {
        alert('请输入邮箱和姓名');
        return;
    }
    try {
        const response = await fetch(`${API_BASE}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, name })
        });
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('userEmail', email);
            document.getElementById('register-form').style.display = 'none';
            document.getElementById('checkin-section').style.display = 'block';
        } else {
            alert(data.error);
        }
    } catch (error) {
        alert('注册失败，请稍后重试');
    }
});

document.getElementById('checkin-btn').addEventListener('click', async () => {
    const email = localStorage.getItem('userEmail');
    if (!email) {
        alert('请先注册');
        return;
    }
    try {
        const response = await fetch(`${API_BASE}/checkin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        const data = await response.json();
        const messageEl = document.getElementById('message');
        if (response.ok) {
            messageEl.textContent = '签到成功！';
            messageEl.style.color = 'green';
        } else {
            messageEl.textContent = data.error;
            messageEl.style.color = 'red';
        }
    } catch (error) {
        alert('签到失败，请稍后重试');
    }
});

document.getElementById('account-btn').addEventListener('click', async () => {
    const email = localStorage.getItem('userEmail');
    if (!email) {
        alert('请先注册');
        return;
    }
    await loadAccountInfo(email);
    document.getElementById('checkin-section').style.display = 'none';
    document.getElementById('account-section').style.display = 'block';
});

document.getElementById('back-btn').addEventListener('click', () => {
    document.getElementById('account-section').style.display = 'none';
    document.getElementById('checkin-section').style.display = 'block';
    document.getElementById('message').textContent = '';
});

async function loadAccountInfo(email) {
    try {
        const response = await fetch(`${API_BASE}/account/${encodeURIComponent(email)}`);
        const data = await response.json();
        if (response.ok) {
            document.getElementById('user-name').innerHTML = `<strong>姓名：</strong> ${data.name}`;
            document.getElementById('user-email').innerHTML = `<strong>邮箱：</strong> ${data.email}`;
            document.getElementById('total-checkins').innerHTML = `<strong>总签到次数：</strong> ${data.totalCheckins}`;
            document.getElementById('streak-days').innerHTML = `<strong>连续签到天数：</strong> ${data.streak}天`;
            renderChart(data.checkinHistory);
        } else {
            alert(data.error);
        }
    } catch (error) {
        alert('加载账户信息失败，请稍后重试');
    }
}

function renderChart(checkinHistory) {
    const ctx = document.getElementById('checkin-chart').getContext('2d');
    
    if (window.myChart) {
        window.myChart.destroy();
    }
    
    const sortedHistory = [...checkinHistory].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    const last30Days = sortedHistory.slice(-30);
    
    const labels = last30Days.map(h => {
        const date = new Date(h.date);
        return `${date.getMonth() + 1}/${date.getDate()}`;
    });
    
    const data = last30Days.map((h, index) => {
        const date = new Date(h.date);
        return date.getDate();
    });
    
    window.myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: '签到日期',
                data: last30Days.map((h, i) => i + 1),
                borderColor: '#0071e3',
                backgroundColor: 'rgba(0, 113, 227, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

// Check if user is already registered
const userEmail = localStorage.getItem('userEmail');
if (userEmail) {
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('checkin-section').style.display = 'block';
}