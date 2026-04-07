/* =========================================================
   ENERGY COMPANION - MAIN SCRIPT
   ---------------------------------------------------------
   This file handles:
   1. Tab switching
   2. Dark mode toggle
   3. Personal goal recommendation text
   4. Card animations
   5. Progress bar animations
   6. Chart.js charts
========================================================= */


/* =========================================================
   SELECT ELEMENTS
========================================================= */
const navButtons = document.querySelectorAll(".nav-btn");
const tabContents = document.querySelectorAll(".tab-content");
const darkModeToggle = document.getElementById("darkModeToggle");
const goalInput = document.getElementById("goalInput");
const goalMessage = document.getElementById("goalMessage");


/* =========================================================
   PROGRESS BAR ANIMATION
   ---------------------------------------------------------
   Reads the width from inline HTML, resets to 0,
   then animates smoothly to the target width.
========================================================= */
function animateProgressBars(scope = document) {
  const bars = scope.querySelectorAll(".progress-fill");

  bars.forEach((bar) => {
    const targetWidth = bar.dataset.width || bar.style.width;

    if (!bar.dataset.width) {
      bar.dataset.width = targetWidth;
    }

    bar.style.width = "0";

    setTimeout(() => {
      bar.style.width = targetWidth;
    }, 120);
  });
}


/* =========================================================
   CARD ANIMATION
   ---------------------------------------------------------
   Gives cards a soft fade-up animation.
========================================================= */
function animateCards(scope = document) {
  const cards = scope.querySelectorAll(".card, .metric-card");

  cards.forEach((card, index) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";

    setTimeout(() => {
      card.style.transition = "opacity 0.55s ease, transform 0.55s ease";
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
    }, index * 70);
  });
}


/* =========================================================
   TAB SWITCHING
========================================================= */
navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const targetTab = button.getAttribute("data-tab");

    navButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    tabContents.forEach((tab) => tab.classList.remove("active"));

    const activeTab = document.getElementById(targetTab);
    if (activeTab) {
      activeTab.classList.add("active");
    }

    setTimeout(() => {
      animateProgressBars(activeTab);
      animateCards(activeTab);

      /* Resize charts when Insights tab is opened.
         This is important because Chart.js inside hidden tabs
         may render incorrectly unless resized after becoming visible. */
      if (targetTab === "insights") {
        resizeAllCharts();
      }
    }, 50);
  });
});


/* =========================================================
   DARK MODE
========================================================= */
if (darkModeToggle) {
  darkModeToggle.addEventListener("change", () => {
    document.body.classList.toggle("dark");
  });
}


/* =========================================================
   PERSONAL GOAL MESSAGE
========================================================= */
if (goalInput && goalMessage) {
  goalInput.addEventListener("input", () => {
    const goalText = goalInput.value.toLowerCase();

    goalMessage.style.opacity = "0";
    goalMessage.style.transform = "translateY(8px)";

    setTimeout(() => {
      if (goalText.includes("water")) {
        goalMessage.textContent = "Focus on shower time and laundry habits.";
      } else if (goalText.includes("bill")) {
        goalMessage.textContent = "Cooling and hot water habits can reduce your bill fastest.";
      } else if (goalText.includes("energy")) {
        goalMessage.textContent = "Air conditioning and appliance habits are your best improvement area.";
      } else {
        goalMessage.textContent = "Small habit changes create the biggest long-term savings.";
      }

      goalMessage.style.transition = "all 0.35s ease";
      goalMessage.style.opacity = "1";
      goalMessage.style.transform = "translateY(0)";
    }, 180);
  });
}


/* =========================================================
   CHART INSTANCES
========================================================= */
let energyLineChartInstance = null;
let energyBreakdownChartInstance = null;
let waterBarChartInstance = null;


/* =========================================================
   WEEKLY ENERGY LINE CHART
========================================================= */
function createEnergyLineChart() {
  const canvas = document.getElementById("energyLineChart");
  if (!canvas || typeof Chart === "undefined") return;

  const ctx = canvas.getContext("2d");

  energyLineChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          label: "usage",
          data: [13, 18, 15, 17, 22, 19, 16],
          borderColor: "#2f66e0",
          backgroundColor: "rgba(47, 102, 224, 0.18)",
          fill: true,
          tension: 0.4,
          pointRadius: 5,
          pointHoverRadius: 7,
          pointBackgroundColor: "#2f66e0",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          borderWidth: 4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1400,
        easing: "easeOutQuart"
      },
      interaction: {
        mode: "index",
        intersect: false
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: "#ffffff",
          titleColor: "#111827",
          bodyColor: "#2f66e0",
          borderColor: "#d1d5db",
          borderWidth: 1,
          padding: 14,
          displayColors: false,
          titleFont: {
            size: 16,
            weight: "normal"
          },
          bodyFont: {
            size: 15,
            weight: "normal"
          },
          callbacks: {
            label: function (context) {
              return "usage : " + context.raw;
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: "#374151",
            font: {
              size: 16
            }
          }
        },
        y: {
          min: 0,
          max: 24,
          ticks: {
            stepSize: 6,
            color: "#6b7280",
            font: {
              size: 14
            }
          },
          grid: {
            color: "rgba(107, 114, 128, 0.25)",
            borderDash: [5, 5]
          }
        }
      }
    }
  });
}


/* =========================================================
   ENERGY BREAKDOWN DOUGHNUT CHART
========================================================= */
function createEnergyBreakdownChart() {
  const canvas = document.getElementById("energyBreakdownChart");
  if (!canvas || typeof Chart === "undefined") return;

  const ctx = canvas.getContext("2d");

  energyBreakdownChartInstance = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: [
        "Air Conditioner",
        "Water Heater",
        "Refrigerator",
        "Laundry",
        "Entertainment"
      ],
      datasets: [
        {
          data: [42, 28, 12, 10, 8],
          backgroundColor: [
            "#2f66e0",
            "#3f7de8",
            "#5c97ee",
            "#84b2f4",
            "#b8d1fa"
          ],
          borderColor: "#f8fafc",
          borderWidth: 6,
          hoverOffset: 8
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "65%",
      animation: {
        animateRotate: true,
        duration: 1400,
        easing: "easeOutQuart"
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: "#ffffff",
          titleColor: "#111827",
          bodyColor: "#111827",
          borderColor: "#d1d5db",
          borderWidth: 1,
          padding: 14,
          displayColors: false,
          titleFont: {
            size: 16,
            weight: "normal"
          },
          bodyFont: {
            size: 15,
            weight: "normal"
          },
          callbacks: {
            label: function (context) {
              return context.label + " : " + context.raw;
            }
          }
        }
      }
    }
  });
}


/* =========================================================
   WEEKLY WATER BAR CHART
========================================================= */
function createWaterBarChart() {
  const canvas = document.getElementById("waterBarChart");
  if (!canvas || typeof Chart === "undefined") return;

  const ctx = canvas.getContext("2d");

  waterBarChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          label: "usage",
          data: [210, 245, 235, 260, 280, 250, 225],
          backgroundColor: "#18b889",
          borderRadius: 18,
          borderSkipped: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1400,
        easing: "easeOutQuart"
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: "#ffffff",
          titleColor: "#111827",
          bodyColor: "#18b889",
          borderColor: "#d1d5db",
          borderWidth: 1,
          padding: 14,
          displayColors: false,
          titleFont: {
            size: 16,
            weight: "normal"
          },
          bodyFont: {
            size: 15,
            weight: "normal"
          },
          callbacks: {
            label: function (context) {
              return "usage : " + context.raw;
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: "#374151",
            font: {
              size: 16
            }
          }
        },
        y: {
          min: 0,
          max: 280,
          ticks: {
            stepSize: 70,
            color: "#6b7280",
            font: {
              size: 14
            }
          },
          grid: {
            color: "rgba(107, 114, 128, 0.25)",
            borderDash: [5, 5]
          }
        }
      }
    }
  });
}


/* =========================================================
   RESIZE CHARTS
========================================================= */
function resizeAllCharts() {
  if (energyLineChartInstance) energyLineChartInstance.resize();
  if (energyBreakdownChartInstance) energyBreakdownChartInstance.resize();
  if (waterBarChartInstance) waterBarChartInstance.resize();
}


/* =========================================================
   PAGE LOAD
========================================================= */
window.addEventListener("load", () => {
  const activeTab = document.querySelector(".tab-content.active");

  if (activeTab) {
    animateProgressBars(activeTab);
    animateCards(activeTab);
  }

  createEnergyLineChart();
  createEnergyBreakdownChart();
  createWaterBarChart();
});