
// REUSABLE TOAST FUNCTION

function showToast(message) {

    let toast = document.getElementById("toast");

    toast.innerText = message;
    toast.className = "show";

    setTimeout(function() {
        toast.className = "";
    }, 3000);
}


// SMOOTH SCROLLING AND BOOK BUTTON

document.querySelectorAll(".book-btn").forEach(function(btn) {

    btn.addEventListener("click", function() {

        document.getElementById("o1").value = this.dataset.match;

        document.getElementById("booking").scrollIntoView({
            behavior: "smooth"
        });

        showToast("Please complete your ticket booking!");

    });

});


// BOOKING FUNCTION

function myfun() {

    let name = document.getElementById("t1").value.trim();
    let email = document.getElementById("e1").value.trim();
    let phone = document.getElementById("p1").value.trim();
    let match = document.getElementById("o1").value;
    let date = document.getElementById("d1").value;
    let ticketType = document.getElementById("c1").value;

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

    let ticketPrice;

    if (ticketType == "General") {
        ticketPrice = 500;
    }
    else if (ticketType == "Premium") {
        ticketPrice = 1000;
    }
    else if (ticketType == "VIP") {
        ticketPrice = 2000;
    }

    let booking = {
        name: name,
        email: email,
        phone: phone,
        match: match,
        date: date,
        ticketType: ticketType,
        ticketPrice: ticketPrice
    };

    let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

    bookings.push(booking);

    localStorage.setItem("bookings", JSON.stringify(bookings));

    showToast("Ticket booked successfully! Price: Rs." + ticketPrice);

    document.getElementById("bookingForm").reset();

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
            <p>Category: ${b.ticketType || "-"}</p>
            <p>Price: Rs.${b.ticketPrice || "-"}</p>
        `;

        div.appendChild(card);

    });

}


// FORM SUBMISSION

document.getElementById("bookingForm").addEventListener("submit", function(e) {

    e.preventDefault();

    myfun();

});


// LOAD BOOKINGS

displayBookings();
