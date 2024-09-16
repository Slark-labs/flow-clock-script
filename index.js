document.addEventListener('DOMContentLoaded', async () => {
  alert("script is running after update as well");
  const clockTimeZones = {}; // Store time zone offset and the initial time for each clock

  async function getTimeForTimeZone(timeZone) {
    try {
      const response = await fetch(`https://worldtimeapi.org/api/timezone/${timeZone}`);
      const data = await response.json();
      // Extract the UTC datetime and the UTC offset from the API response
      const localDate = new Date();  // Use the UTC datetime from the API
      const utcOffset = data?.utc_offset;  // e.g., "+05:00" or "-03:30"
      // Get the local system's time zone offset in minutes (negative for zones ahead of UTC)
      const localOffsetMinutes = localDate.getTimezoneOffset() >= 0 ? localDate.getTimezoneOffset() : -localDate.getTimezoneOffset();  // in minutes
  
      // Convert the target time zone offset into minutes
      const offsetHours = parseInt(utcOffset.slice(0, 3), 10);  // Hours part (+05 or -03)
      const offsetMinutes = parseInt(utcOffset.slice(4, 6), 10);  // Minutes part (00 or 30)
      const totalOffsetMinutes = offsetHours * 60 + (offsetHours >= 0 ? offsetMinutes : -offsetMinutes);  // Total minutes for the target time zone
      console.log({ totalOffsetMinutes, localOffsetMinutes, utcOffset})

      // Adjust the UTC time by subtracting the local time zone offset and adding the target time zone offset
      const adjustedTime = new Date(localDate.getTime() + (totalOffsetMinutes - localOffsetMinutes) * 60 * 1000);
  
      return adjustedTime;  // Return the adjusted Date object
    } catch (error) {
      console.error('Error fetching time:', error);
      return null;
    }
  }
  

  // Initialize all clocks on the page
  async function initializeClocks() {
    // Find all clocks (class clock1 to clock6) and set initial rotation
    const clocks = document.getElementsByClassName("clock");
    Array.from(clocks).forEach(async clock => {
      if (clock) {
        const secondArm = clock.querySelector('#second-arm');
        const minuteArm = clock.querySelector('#minute-arm');
        const hourArm = clock.querySelector('#hour-arm');
        const clockId = clock.getAttribute('id');

        if (secondArm && minuteArm && hourArm) {
          // If the clock has an ID, hit the API to get the time zone once
          if (clockId) {
            try {
              // const response = await fetch(`https://data-client-mb-awan-mbawans-projects.vercel.app/api/clocks/${clockId}`); // Adjust this URL to your actual API endpoint
              const response = await fetch(`http://localhost:3001/api/clocks/${clockId}`); // Adjust this URL to your actual API endpoint
              const { data } = await response.json();

              if (data?.status === 'deleted') {
                clock.style.display = 'none';
                return; // Exit if the clock is deleted
              }
              
              if (data?.timezone) {
                const timeZoneTime = await getTimeForTimeZone(data?.timezone);
                if (timeZoneTime) {
                  // Store the timezone time and offset in clockTimeZones for future updates
                  clockTimeZones[clockId] = {
                    time: timeZoneTime,
                    offset: timeZoneTime.getTime() - new Date().getTime() // Store the offset between time zone and local time
                  };
                  console.log({timeZoneTime})
                  setInitialTime(hourArm, minuteArm, secondArm, timeZoneTime);
                  return;
                }
              }
            } catch (error) {
              console.error(`Error fetching time zone for clock ID ${clockId}:`, error);
            }
          }

          // Fallback to local time if no time zone was found or an error occurred
          setInitialTime(hourArm, minuteArm, secondArm, new Date());
        }
      }
    });
  }

  // Function to rotate the hands to the current time
  function setInitialTime(hourArm, minuteArm, secondArm, time) {
    console.log({time});
    const seconds = time.getSeconds();
    const minutes = time.getMinutes();
    const hours = time.getHours();

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
    for (let i = 1; i <= 6; i++) {
      const clock = document.querySelector(`.clock${i}`);
      if (clock) {
        const secondArm = clock.querySelector('#second-arm');
        const minuteArm = clock.querySelector('#minute-arm');
        const hourArm = clock.querySelector('#hour-arm');
        const clockId = clock.getAttribute('id');
        let now = new Date(); // Default to local time

        if (secondArm && minuteArm && hourArm) {
          // If the clock has an ID and has a stored time zone offset, apply the offset
          if (clockId && clockTimeZones[clockId]) {
            const { time, offset } = clockTimeZones[clockId];

            // Add the stored offset to the current time
            now = new Date(new Date().getTime() + offset);
          }

          const seconds = now.getSeconds();
          const minutes = now.getMinutes();
          const hours = now.getHours();

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
  await initializeClocks();

  // Update every second
  setInterval(updateClocks, 1000);
});
