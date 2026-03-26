function scrollToSection() {
  document.getElementById("features").scrollIntoView({
    behavior: "smooth"
  });
}

function validateEmail() {
  const email = document.getElementById("email").value;
  const msg = document.getElementById("msg");

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (email === "") {
    msg.textContent = "Email field cannot be empty";
    msg.style.color = "red";
    return false;
  }

  if (!emailPattern.test(email)) {
    msg.textContent = "Please enter a valid email";
    msg.style.color = "red";
    return false;
  }

  msg.textContent = "Subscribed successfully!";
  msg.style.color = "green";

  setTimeout(() =>{
    msg.textContent = "";
  },3000)
  return false;
}
function toggleMode() {
  document.body.classList.toggle("dark");

  const btn = document.querySelector(".mode");
  btn.textContent = document.body.classList.contains("dark") ? "☀" : "🌙";
}

function revealOnScroll() {
  document.querySelectorAll(".reveal").forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight - 100) {
      el.classList.add("active");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);