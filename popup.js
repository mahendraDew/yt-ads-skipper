document.getElementById('toggle').addEventListener('click', function() {
  const status = document.getElementById('status');
  const button = document.getElementById('toggle');

  if (status.textContent === 'Enabled') {
    status.textContent = 'Disabled';
    status.style.color = 'red';
    button.textContent = 'Enable';
    // Add logic to disable ad skipping here
  } else {
    status.textContent = 'Enabled';
    status.style.color = 'green';
    button.textContent = 'Disable';
    // Add logic to enable ad skipping here
  }
});



// document.addEventListener("DOMContentLoaded", function () {
//   // Get the counter from local storage
//   chrome.storage.local.get("adSkipCounter", function (result) {
//     const adCounter = document.getElementById("adCounter");
//     adCounter.textContent = result.adSkipCounter || 0; // Default to 0 if no ads skipped
//   });


document.addEventListener("DOMContentLoaded", function () {
  // Retrieve the adSkipCounter from chrome.storage.local when popup is opened
  chrome.storage.local.get("adSkipCounter", function (result) {
    // Get the current counter value or default to 0 if undefined
    const adSkipCounter = result.adSkipCounter || 0;
    
    // Log the fetched adSkipCounter
    console.log("Fetched adSkipCounter:", adSkipCounter);

    // Update the popup display with the counter value
    const adCounterElement = document.getElementById("adCounter");
    adCounterElement.textContent = adSkipCounter;

    // Update the storage when needed
    // For example, if you want to update the counter in popup.js:
    // chrome.storage.local.set({ adSkipCounter: adSkipCounter + 1 }, function () {
    //   console.log(`Stored updated adSkipCounter: ${adSkipCounter + 1}`);
    // });
  });
});