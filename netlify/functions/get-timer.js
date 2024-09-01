// netlify/functions/get-timer.js
exports.handler = async function(event, context) {
    const countdownStartTime = new Date('2024-09-01T00:00:00Z'); // Adjust to your desired start time
    const countdownDuration = 108 * 60 * 1000; // 108 minutes in milliseconds

    const currentTime = new Date();
    const elapsedTime = currentTime - countdownStartTime;
    const timeLeft = countdownDuration - (elapsedTime % countdownDuration);

    return {
        statusCode: 200,
        body: JSON.stringify({ timeLeft: Math.max(0, timeLeft / 1000) }) // Return time left in seconds
    };
};