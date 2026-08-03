(() => {
  "use strict";

  const startScreen = document.getElementById("start-screen");
  const gameScreen = document.getElementById("game-screen");
  const startButton = document.getElementById("start-button");
  const resetButton = document.getElementById("reset-button");
  const roleLabel = document.getElementById("player-role");
  const canvas = document.getElementById("game-canvas");
  const ctx = canvas.getContext("2d");

  let selectedCharacter = null;
  let gameRunning = false;
  let paused = false;

  const keys = Object.create(null);

  const player = {
    x: 540,
    y: 590,
    speed: 4,
    emoji: "👧"
  };

  const state = {
    coins: 0,
    xp: 0,
    happiness: 10,
    environment: 5,
    safety: 5,
    health: 5,
    education: 5,
    missionIndex: 0
  };

  const buildings = [
    { id: "hall", name: "City Hall", x: 455, y: 28, w: 190, h: 100, emoji: "🏛️" },
    { id: "school", name: "School", x: 65, y: 165, w: 180, h: 110, emoji: "🏫" },
    { id: "hospital", name: "Hospital", x: 325, y: 165, w: 180, h: 110, emoji: "🏥" },
    { id: "market", name: "Market", x: 585, y: 165, w: 180, h: 110, emoji: "🏪" },
    { id: "police", name: "Police Station", x: 845, y: 165, w: 190, h: 110, emoji: "👮" },
    { id: "fire", name: "Fire Station", x: 65, y: 410, w: 180, h: 110, emoji: "🚒" },
    { id: "park", name: "Park", x: 325, y: 410, w: 180, h: 110, emoji: "🌳" },
    { id: "stable", name: "Horse Stable", x: 585, y: 410, w: 180, h: 110, emoji: "🐎" },
    { id: "homes", name: "Homes", x: 845, y: 410, w: 190, h: 110, emoji: "🏠" }
  ];

  const missions = [
    {
      target: "hall",
      title: "Meet the Mayor",
      description: "Go to City Hall and press E.",
      rewardText: "100 coins + 50 XP",
      coins: 100,
      xp: 50,
      stat: "happiness",
      gain: 10
    },
    {
      target: "school",
      title: "Deliver School Supplies",
      description: "Take books and supplies to the school.",
      rewardText: "120 coins + 60 XP",
      coins: 120,
      xp: 60,
      stat: "education",
      gain: 15
    },
    {
      target: "market",
      title: "Restock the Market",
      description: "Help place fresh food on the shelves.",
      rewardText: "130 coins + 60 XP",
      coins: 130,
      xp: 60,
      stat: "happiness",
      gain: 10
    },
    {
      target: "park",
      title: "Plant New Trees",
      description: "Help make the park greener.",
      rewardText: "150 coins + 80 XP",
      coins: 150,
      xp: 80,
      stat: "environment",
      gain: 20
    },
    {
      target: "hospital",
      title: "Deliver Medical Supplies",
      description: "Bring supplies safely to the hospital.",
      rewardText: "160 coins + 90 XP",
      coins: 160,
      xp: 90,
      stat: "health",
      gain: 20
    },
    {
      target: "police",
      title: "Road Safety Day",
      description: "Help place road-safety signs.",
      rewardText: "150 coins + 80 XP",
      coins: 150,
      xp: 80,
      stat: "safety",
      gain: 20
    },
    {
      target: "fire",
      title: "Fire Safety Check",
      description: "Help check the station's safety equipment.",
      rewardText: "150 coins + 80 XP",
      coins: 150,
      xp: 80,
      stat: "safety",
      gain: 15
    },
    {
      target: "stable",
      title: "Care for the Horses",
      description: "Feed and brush the horses.",
      rewardText: "140 coins + 70 XP",
      coins: 140,
      xp: 70,
      stat: "happiness",
      gain: 10
    },
    {
      target: "homes",
      title: "Help the Neighborhood",
      description: "Deliver a community package.",
      rewardText: "180 coins + 100 XP",
      coins: 180,
      xp: 100,
      stat: "happiness",
      gain: 15
    }
  ];

  document.querySelectorAll(".character-card").forEach((card) => {
    card.addEventListener("click", () => {
      document.querySelectorAll(".character-card").forEach((item) => {
        item.classList.remove("selected");
      });

      card.classList.add("selected");
      selectedCharacter = card.dataset.character;
      player.emoji = {
        girl: "👧",
        boy: "👦",
        woman: "👩",
        man: "👨"
      }[selectedCharacter];

      startButton.disabled = false;
    });
  });

  startButton.addEventListener("click", () => {
    if (!selectedCharacter) return;

    const isStudent = selectedCharacter === "girl" || selectedCharacter === "boy";
    roleLabel.textContent = isStudent ? "— Student" : "— Community Volunteer";

    startScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");
    gameRunning = true;

    updateMissionPanel();
    updateStats();
    requestAnimationFrame(gameLoop);
  });

  resetButton.addEventListener("click", () => {
    window.location.reload();
  });

  window.addEventListener("keydown", (event) => {
    keys[event.key.toLowerCase()] = true;

    if (event.key.toLowerCase() === "e") {
      interact();
    }

    if (event.key.toLowerCase() === "p") {
      paused = !paused;
    }
  });

  window.addEventListener("keyup", (event) => {
    keys[event.key.toLowerCase()] = false;
  });

  function gameLoop() {
    if (!gameRunning) return;

    if (!paused) {
      updatePlayer();
      drawGame();
    } else {
      drawGame();
      drawPauseOverlay();
    }

    requestAnimationFrame(gameLoop);
  }

  function updatePlayer() {
    let dx = 0;
    let dy = 0;

    if (keys.arrowleft || keys.a) dx -= 1;
    if (keys.arrowright || keys.d) dx += 1;
    if (keys.arrowup || keys.w) dy -= 1;
    if (keys.arrowdown || keys.s) dy += 1;

    if (dx !== 0 && dy !== 0) {
      dx *= 0.707;
      dy *= 0.707;
    }

    player.x = Math.max(18, Math.min(canvas.width - 18, player.x + dx * player.speed));
    player.y = Math.max(18, Math.min(canvas.height - 18, player.y + dy * player.speed));
  }

  function drawRoad(x, y, width, height) {
    ctx.fillStyle = "#70777a";
    ctx.fillRect(x, y, width, height);

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.setLineDash([18, 18]);
    ctx.beginPath();

    if (width > height) {
      ctx.moveTo(x, y + height / 2);
      ctx.lineTo(x + width, y + height / 2);
    } else {
      ctx.moveTo(x + width / 2, y);
      ctx.lineTo(x + width / 2, y + height);
    }

    ctx.stroke();
    ctx.setLineDash([]);
  }

  function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#93d66f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawRoad(0, 310, 1100, 65);
    drawRoad(262, 0, 55, 680);
    drawRoad(785, 0, 55, 680);

    buildings.forEach((building) => {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(building.x, building.y, building.w, building.h);

      ctx.strokeStyle = "#17323f";
      ctx.lineWidth = 4;
      ctx.strokeRect(building.x, building.y, building.w, building.h);

      ctx.textAlign = "center";
      ctx.font = "46px Arial";
      ctx.fillText(building.emoji, building.x + building.w / 2, building.y + 58);

      ctx.font = "18px Arial";
      ctx.fillStyle = "#17323f";
      ctx.fillText(building.name, building.x + building.w / 2, building.y + building.h - 17);
    });

    for (let index = 0; index < 20; index += 1) {
      ctx.font = "26px Arial";
      ctx.fillText("🌲", 20 + index * 55, 665);
    }

    const mission = missions[state.missionIndex];

    if (mission) {
      const target = buildings.find((building) => building.id === mission.target);
      ctx.strokeStyle = "#ffd700";
      ctx.lineWidth = 7;
      ctx.strokeRect(target.x - 7, target.y - 7, target.w + 14, target.h + 14);
    }

    ctx.font = "36px Arial";
    ctx.fillText(player.emoji, player.x, player.y);
  }

  function drawPauseOverlay() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 58px Arial";
    ctx.textAlign = "center";
    ctx.fillText("PAUSED", canvas.width / 2, canvas.height / 2);
  }

  function isNear(building) {
    const centerX = building.x + building.w / 2;
    const centerY = building.y + building.h / 2;
    return Math.hypot(player.x - centerX, player.y - centerY) < 128;
  }

  function interact() {
    if (!gameRunning || paused) return;

    const mission = missions[state.missionIndex];

    if (!mission) {
      showMessage("All prototype missions are complete. National City is thriving!");
      return;
    }

    const target = buildings.find((building) => building.id === mission.target);

    if (!isNear(target)) {
      showMessage(`Move closer to ${target.name}, then press E.`);
      return;
    }

    state.coins += mission.coins;
    state.xp += mission.xp;
    state[mission.stat] = Math.min(100, state[mission.stat] + mission.gain);

    showMessage(`Mission complete! You earned ${mission.rewardText}.`);
    state.missionIndex += 1;

    updateStats();
    updateMissionPanel();
  }

  function updateMissionPanel() {
    const mission = missions[state.missionIndex];

    if (!mission) {
      document.getElementById("mission-title").textContent = "National City Hero!";
      document.getElementById("mission-description").textContent =
        "You completed every mission in this prototype.";
      document.getElementById("mission-reward").textContent =
        "City celebration unlocked";
      return;
    }

    document.getElementById("mission-title").textContent = mission.title;
    document.getElementById("mission-description").textContent = mission.description;
    document.getElementById("mission-reward").textContent = mission.rewardText;
  }

  function updateStats() {
    document.getElementById("coins").textContent = state.coins;
    document.getElementById("xp").textContent = state.xp;
    document.getElementById("happiness-value").textContent = state.happiness;

    document.getElementById("happiness-bar").value = state.happiness;
    document.getElementById("environment-bar").value = state.environment;
    document.getElementById("safety-bar").value = state.safety;
    document.getElementById("health-bar").value = state.health;
    document.getElementById("education-bar").value = state.education;
  }

  function showMessage(message) {
    document.getElementById("message-box").textContent = message;
  }

  updateStats();
})();
