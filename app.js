
// REUSABLE TOAST FUNCTION

let toastTimer;

function showToast(message) {

    let toast = document.getElementById("toast");

    toast.innerText = message;
    toast.className = "show";

    clearTimeout(toastTimer);

    toastTimer = setTimeout(function() {
        toast.className = "";
    }, 3000);
}


// SMOOTH SCROLLING AND BOOK BUTTON

document.querySelectorAll(".book-btn").forEach(function(btn) {

    btn.addEventListener("click", function() {

        document.getElementById("o1").value = this.dataset.match;

        updateSummary(false);

        document.getElementById("booking").scrollIntoView({
            behavior: "smooth"
        });

        showToast("Please complete your ticket booking!");

    });

});


// TICKET PRICE FUNCTION

function getTicketPrice(stand) {

    if (stand == "General") {
        return 500;
    }
    else if (stand == "Premium") {
        return 1000;
    }
    else if (stand == "VIP") {
        return 2000;
    }

    return 0;
}


// LIVE BOOKING SUMMARY

function updateSummary(showMessage = true) {

    let match = document.getElementById("o1").value;

    let stand = document.getElementById("c1").value;

    let quantity = parseInt(document.getElementById("q1").value);

    let price = getTicketPrice(stand);

    if (isNaN(quantity) || quantity < 1) {
        quantity = 0;
    }

    let total = price * quantity;

    document.getElementById("summaryMatch").innerText = match;

    document.getElementById("summaryStand").innerText = stand;

    document.getElementById("summaryQuantity").innerText = quantity;

    document.getElementById("summaryPrice").innerText = price;

    document.getElementById("summaryTotal").innerText = total;

    if (showMessage) {
        showToast("Booking summary updated!");
    }

}


// DOM SELECTORS

let matchSelect = document.getElementById("o1");

let standSelect = document.querySelector("#c1");

let quantityInput = document.getElementById("q1");


// CHANGE EVENT LISTENERS

matchSelect.addEventListener("change", function() {
    updateSummary();
});

standSelect.addEventListener("change", function() {
    updateSummary();
});

quantityInput.addEventListener("change", function() {
    updateSummary();
});


// LIVE QUANTITY UPDATE

quantityInput.addEventListener("input", function() {
    updateSummary(false);
});


// BOOKING FUNCTION

function myfun() {

    let name = document.getElementById("t1").value.trim();

    let email = document.getElementById("e1").value.trim();

    let phone = document.getElementById("p1").value.trim();

    let match = matchSelect.value;

    let date = document.getElementById("d1").value;

    let ticketType = standSelect.value;

    let quantity = parseInt(quantityInput.value);

    let ticketPrice = getTicketPrice(ticketType);

    let totalPrice = ticketPrice * quantity;


    if (name == "") {
        alert("Please enter your name");
        return false;
    }

    if (email == "") {
        alert("Please enter your email");
        return false;
    }

    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        alert("Please enter a valid email");
        return false;
    }

    if (phone == "") {
        alert("Please enter your phone number");
        return false;
    }

    let phonePattern = /^[0-9]{10}$/;

    if (!phonePattern.test(phone)) {
        alert("Please enter a valid 10 digit phone number");
        return false;
    }

    if (date == "") {
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


    // SAVE TO LOCAL STORAGE

    let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

    bookings.push(booking);

    localStorage.setItem("bookings", JSON.stringify(bookings));


    showToast("Booking successful! Total: Rs." + totalPrice);

    document.getElementById("bookingForm").reset();

    updateSummary(false);

    displayBookings();

    return true;

}


// DISPLAY BOOKINGS

function displayBookings() {

    let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

    let div = document.getElementById("myid");

    div.innerHTML = "";

    if (bookings.length == 0) {
        div.innerHTML = "<p>No bookings available</p>";
        return;
    }

    bookings.forEach(function(b, i) {

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

document.getElementById("bookingForm").addEventListener("submit", function(e) {

    e.preventDefault();

    myfun();

});


// INITIAL LOAD

updateSummary(false);

displayBookings();
