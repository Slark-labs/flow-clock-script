document.addEventListener('DOMContentLoaded', () => {
  // Initialize all clocks on the page
  function initializeClocks() {
    // Get the current local time
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    
    // Find all clocks (class clock1 to clock6) and set initial rotation
    for (let i = 1; i <= 6; i++) {
      const clock = document.querySelector(`.clock${i}`);
      if (clock) {
        const secondArm = clock.querySelector('#second-arm');
        const minuteArm = clock.querySelector('#minute-arm');
        const hourArm = clock.querySelector('#hour-arm');

        if (secondArm && minuteArm && hourArm) {
          setInitialTime(hourArm, minuteArm, secondArm, hours, minutes, seconds);
        }
      }
    }
  }

  // Function to rotate the hands to the current time
  function setInitialTime(hourArm, minuteArm, secondArm, hours, minutes, seconds) {
    const secondDegree = (seconds / 60) * 360;
    const minuteDegree = (minutes / 60) * 360 + (seconds / 60) * 6;
    const hourDegree = (hours % 12) * 30 + (minutes / 60) * 30;

    // Apply initial rotation to each hand
    secondArm.style.transform = `rotate(${secondDegree}deg)`;
    minuteArm.style.transform = `rotate(${minuteDegree}deg)`;
    hourArm.style.transform = `rotate(${hourDegree}deg)`;
  }

  // Function to update the clock every second
  function updateClocks() {
    const now = new Date();
    const seconds = now.getSeconds();
    const minutes = now.getMinutes();
    const hours = now.getHours();

    for (let i = 1; i <= 6; i++) {
      const clock = document.querySelector(`.clock${i}`);
      if (clock) {
        const secondArm = clock.querySelector('#second-arm');
        const minuteArm = clock.querySelector('#minute-arm');
        const hourArm = clock.querySelector('#hour-arm');

        if (secondArm && minuteArm && hourArm) {
          // Increment rotation by 6 degrees per second, 0.1 degrees per second for minutes, 0.5 degrees per minute for hours
          const secondDegree = (seconds / 60) * 360;
          const minuteDegree = (minutes / 60) * 360 + (seconds / 60) * 6;
          const hourDegree = (hours % 12) * 30 + (minutes / 60) * 30;

          secondArm.style.transform = `rotate(${secondDegree}deg)`;
          minuteArm.style.transform = `rotate(${minuteDegree}deg)`;
          hourArm.style.transform = `rotate(${hourDegree}deg)`;
        }
      }
    }
  }

  // Start the clocks
  initializeClocks();

  // Update every second
  setInterval(updateClocks, 1000);
});
