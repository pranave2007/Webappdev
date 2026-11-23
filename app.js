
// ACTIVITY 5: REUSABLE TOAST FUNCTION
let toastTimer;

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.innerText = message;
    toast.className = "show";

    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
        toast.className = "";
    }, 3000);
}


// ACTIVITY 8: HAMBURGER MENU
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", function () {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", isOpen);
});

// Close menu after clicking a navigation link
navLinks.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
    });
});


// ACTIVITY 8: FILTER MATCH CARDS BY TEAM
const teamFilter = document.getElementById("teamFilter");
const matchCards = document.querySelectorAll(".match-card");
const noMatches = document.getElementById("noMatches");

teamFilter.addEventListener("change", function () {
    const selectedTeam = this.value;
    let visibleCount = 0;

    matchCards.forEach(function (card) {
        const teams = card.dataset.teams.split(" ");

        const showCard =
            selectedTeam === "all" ||
            teams.includes(selectedTeam);

        card.hidden = !showCard;

        if (showCard) {
            visibleCount++;
        }
    });

    noMatches.hidden = visibleCount !== 0;
});


// ACTIVITY 8: GRID AND LIST VIEW
const matchContainer = document.getElementById("matchContainer");
const gridViewBtn = document.getElementById("gridViewBtn");
const listViewBtn = document.getElementById("listViewBtn");

gridViewBtn.addEventListener("click", function () {
    matchContainer.classList.remove("match-list");
    matchContainer.classList.add("match-grid");

    gridViewBtn.classList.add("active");
    listViewBtn.classList.remove("active");
});

listViewBtn.addEventListener("click", function () {
    matchContainer.classList.remove("match-grid");
    matchContainer.classList.add("match-list");

    listViewBtn.classList.add("active");
    gridViewBtn.classList.remove("active");
});


// BOOK BUTTON: SELECT MATCH AND SCROLL TO FORM
document.querySelectorAll(".book-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
        document.getElementById("o1").value =
            this.dataset.match;

        updateSummary(false);

        document.getElementById("booking").scrollIntoView({
            behavior: "smooth"
        });

        showToast("Please complete your ticket booking!");
    });
});


// ACTIVITY 7: TICKET PRICE
function getTicketPrice(stand) {
    if (stand === "General") return 500;
    if (stand === "Premium") return 1000;
    if (stand === "VIP") return 2000;

    return 0;
}


// ACTIVITY 7: LIVE BOOKING SUMMARY
function updateSummary(showMessage = true) {
    const match = document.getElementById("o1").value;
    const stand = document.getElementById("c1").value;

    let quantity = parseInt(
        document.getElementById("q1").value, 10
    );

    if (isNaN(quantity) || quantity < 1) {
        quantity = 0;
    }

    const price = getTicketPrice(stand);
    const total = price * quantity;

    document.getElementById("summaryMatch").innerText = match;
    document.getElementById("summaryStand").innerText = stand;
    document.getElementById("summaryQuantity").innerText = quantity;
    document.getElementById("summaryPrice").innerText = price;
    document.getElementById("summaryTotal").innerText = total;

    if (showMessage) {
        showToast("Booking summary updated!");
    }
}


// DOM SELECTORS AND CHANGE EVENTS
const matchSelect = document.getElementById("o1");
const standSelect = document.querySelector("#c1");
const quantityInput = document.getElementById("q1");

matchSelect.addEventListener("change", function () {
    updateSummary();
});

standSelect.addEventListener("change", function () {
    updateSummary();
});

quantityInput.addEventListener("change", function () {
    updateSummary();
});

quantityInput.addEventListener("input", function () {
    updateSummary(false);
});


// BOOKING FUNCTION
function myfun() {
    const name = document.getElementById("t1").value.trim();
    const email = document.getElementById("e1").value.trim();
    const phone = document.getElementById("p1").value.trim();

    const match = matchSelect.value;
    const date = document.getElementById("d1").value;
    const ticketType = standSelect.value;

    const quantity = parseInt(quantityInput.value, 10);
    const ticketPrice = getTicketPrice(ticketType);
    const totalPrice = ticketPrice * quantity;

    if (name === "") {
        alert("Please enter your name");
        return false;
    }

    if (email === "") {
        alert("Please enter your email");
        return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        alert("Please enter a valid email");
        return false;
    }

    if (phone === "") {
        alert("Please enter your phone number");
        return false;
    }

    const phonePattern = /^[0-9]{10}$/;

    if (!phonePattern.test(phone)) {
        alert("Please enter a valid 10 digit phone number");
        return false;
    }

    if (date === "") {
        alert("Please select a date");
        return false;
    }

    if (isNaN(quantity) || quantity < 1 || quantity > 10) {
        alert("Please enter quantity between 1 and 10");
        return false;
    }


    // BOOKING OBJECT
    let booking = {
        name: name,
        email: email,
        phone: phone,
        match: match,
        date: date,
        ticketType: ticketType,
        quantity: quantity,
        ticketPrice: ticketPrice,
        totalPrice: totalPrice
    };


    // SAVE BOOKING IN LOCAL STORAGE
    let bookings = JSON.parse(
        localStorage.getItem("bookings")
    ) || [];

    bookings.push(booking);

    localStorage.setItem(
        "bookings",
        JSON.stringify(bookings)
    );


    showToast("Booking successful! Total: Rs." + totalPrice);

    document.getElementById("bookingForm").reset();

    updateSummary(false);

    displayBookings();

    return true;
}


// DISPLAY SAVED BOOKINGS
function displayBookings() {
    let bookings = JSON.parse(
        localStorage.getItem("bookings")
    ) || [];

    let div = document.getElementById("myid");

    div.innerHTML = "";

    if (bookings.length === 0) {
        div.innerHTML = "<p>No bookings available</p>";
        return;
    }

    bookings.forEach(function (b, i) {

        let card = document.createElement("div");

        card.className = "booking-card";

        card.innerHTML = `
            <h3>Booking ${i + 1}</h3>

            <p>Name: ${b.name || "-"}</p>
            <p>Email: ${b.email || "-"}</p>
            <p>Phone: ${b.phone || "-"}</p>
            <p>Match: ${b.match || "-"}</p>
            <p>Date: ${b.date || "-"}</p>
            <p>Stand: ${b.ticketType || "-"}</p>
            <p>Quantity: ${b.quantity || 1}</p>
            <p>Price per ticket: Rs.${b.ticketPrice || "-"}</p>
            <p>Total Price: Rs.${b.totalPrice || b.ticketPrice || "-"}</p>
        `;

        div.appendChild(card);
    });
}


// FORM SUBMISSION
document.getElementById("bookingForm").addEventListener(
    "submit",
    function (event) {
        event.preventDefault();
        myfun();
    }
);


// INITIAL PAGE LOAD
updateSummary(false);
displayBookings();
