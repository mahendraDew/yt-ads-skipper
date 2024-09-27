const defined = (v) => v !== null && v !== undefined;
let adSkipCounter = 0;
let actionIntervalId = null

console.log("hey there lfg>>>>")
console.log(window.location.pathname)

const updateAdCounter = () => {
  // Increment counter for skipped ads
  adSkipCounter += 1;

  // Store it in chrome local storage
  chrome.storage.local.set({ adSkipCounter }, function () {
    console.log(`Ad skipped! Current count: ${adSkipCounter}`);
  });
};

const clickSkipButton = () => {
  // console.log("from clickSkipButton reporting....")
  const skipButton = document.querySelector(".ytp-skip-ad-button");
  const skipButtonModern = document.querySelector(".ytp-ad-skip-button-modern");

  if (defined(skipButton)) {
    skipButton.click();
    updateAdCounter(); // Increment counter when ad is skipped
    console.log("add skipped +1")
    return true;
  }

  if (defined(skipButtonModern)) {
    skipButtonModern.click();
    updateAdCounter(); // Increment counter when ad is skipped
    return true;
  }

  return false;
};

// Reset the counter when a new video is started
const resetAdCounter = () => {
  adSkipCounter = 0;
  chrome.storage.local.set({ adSkipCounter }, function () {
    console.log("Ad skip counter reset.");
  });
};

const observeNewVideo = () => {
  const videoElement = document.querySelector("video");
  if (videoElement) {
    videoElement.addEventListener("play", resetAdCounter);
  }
};

// Run the observer to detect new videos
observeNewVideo();

const stopYoutubeAd = () => {
  // console.log("stopYouTubeAd reporting.....")
  const adElement = document.querySelector(".ad-showing.ad-interrupting video");

  if (adElement && adElement.readyState >= 3) {
    adElement.currentTime = adElement.duration - 1;
  }

  clickSkipButton();

  const overlayAds = document.querySelectorAll(".ytp-ad-overlay-slot");
  overlayAds.forEach((overlayAd) => {
    overlayAd.style.visibility = "hidden";
  });
};



const performActions = (settings) => {
  const {
    "youtube-ads": youtubeAds,
    "youtube-errors": youtubeErrors,
  } = settings;

  if (youtubeAds !== false) {
    try {
      stopYoutubeAd();
    } catch (e) {
      if (youtubeErrors) {
        const errorInfo = { stack: e.stack };
        chrome.storage.sync.set({ "youtube-error-message": errorInfo });
      }
    }
  }

}

const startActionsInterval = (settings) => {
  // console.log("startActionsInterval se reporting.....")
  actionIntervalId = setInterval(() => {
    if (window.location.pathname === "/watch") {
      performActions(settings);
    } else {
      clearInterval(actionIntervalId);
      actionIntervalId = null;
      checkAndStartActions();
      console.log("else wala part log hua>>>>>")
    }
  }, 300);
};

const checkAndStartActions = () => {
  const isWatchPage = window.location.pathname.includes("/watch");
  
  if (isWatchPage && !actionIntervalId && chrome?.storage?.sync) {
    chrome.storage.sync
    .get([
      "youtube-ads",
      "youtube-errors",
    ])
    .then((settings) => {
      startActionsInterval(settings);
    });
  }
};


let checkIntervalId = setInterval(checkAndStartActions, 1000);