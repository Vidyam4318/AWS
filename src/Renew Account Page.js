async function renewAccount(userId) {
    const newEndDate = new Date(new Date().setDate(new Date().getDate() + 30)); // Add 30 more days

    const response = await fetch('https://your-cloud-function-url/renew-account', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userId: userId,
            newEndDate: newEndDate.toISOString()
        })
    });

    const result = await response.json();
    if (response.ok) {
        alert("Your account has been renewed successfully!");
    } else {
        alert("Error: " + result.error);
    }
}
