gsap.registerPlugin(ScrollTrigger);

gsap.from(".hero", {
  opacity: 0,
  y: 50,
  duration: 1
});

gsap.from(".section", {
  scrollTrigger: ".section",
  opacity: 0,
  y: 40,
  stagger: 0.3
});
