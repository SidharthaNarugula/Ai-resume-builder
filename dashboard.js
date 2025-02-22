async function fetchAnalytics(userId) {
    try {
        const response = await fetch(`http://localhost:5000/analytics/${userId}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        
        document.getElementById("applicationsSent").innerText = data.applicationsSent;
        document.getElementById("interviewsScheduled").innerText = data.interviewsScheduled;
        document.getElementById("recruiterViews").innerText = data.recruiterViews;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}
