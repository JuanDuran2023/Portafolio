document.querySelectorAll('.skill-progress').forEach(el => {
  const circle = el.querySelector('.progress-ring__circle');
  const radius = circle.r.baseVal.value;
  const circumference = 2 * Math.PI * radius;
  const percent = el.dataset.percent;

  circle.style.strokeDasharray = `${circumference}`;
  const offset = circumference - (percent / 100) * circumference;
  circle.style.strokeDashoffset = offset;
});